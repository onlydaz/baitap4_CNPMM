const es = require('../config/elasticsearch');

const INDEX_ALIAS = 'products_current';

const ensureIndex = async () => {
  if (!es) return; // ES disabled
  const alias = INDEX_ALIAS;
  const exists = await es.indices.existsAlias({ name: alias }).catch(() => false);
  if (exists && exists.acknowledged !== false) return;

  const indexName = 'products_v1';
  const hasIndex = await es.indices.exists({ index: indexName });
  if (!hasIndex) {
    await es.indices.create({
      index: indexName,
      settings: {
        analysis: {
          analyzer: {
            vi_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding']
            },
            edge_ngram_analyzer: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'asciifolding', 'edge_ngram_filter']
            }
          },
          filter: {
            edge_ngram_filter: { type: 'edge_ngram', min_gram: 1, max_gram: 15 }
          }
        }
      },
      mappings: {
        properties: {
          id: { type: 'integer' },
          name: { type: 'text', analyzer: 'vi_analyzer', fields: { suggest: { type: 'text', analyzer: 'edge_ngram_analyzer' }, keyword: { type: 'keyword' } } },
          description: { type: 'text', analyzer: 'vi_analyzer' },
          image: { type: 'keyword' },
          category_id: { type: 'keyword' },
          price: { type: 'double' },
          stock: { type: 'integer' },
          status: { type: 'keyword' },
          discount_percent: { type: 'double' },
          views: { type: 'long' },
          tags: { type: 'keyword' }
        }
      }
    });
  }
  // create alias if missing
  const aliasExists = await es.indices.existsAlias({ name: alias }).catch(() => false);
  if (!aliasExists) {
    await es.indices.updateAliases({
      actions: [{ add: { index: indexName, alias } }]
    });
  }
};

const buildEsQuery = (params) => {
  const {
    q,
    category_id,
    price_min,
    price_max,
    has_promo,
    discount_min,
    views_min
  } = params;

  const must = [];
  const filter = [{ term: { status: 'active' } }];
  const should = [];

  if (q && q.trim().length > 0) {
    must.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'name.suggest^2', 'description', 'tags^1.5'],
        type: 'best_fields',
        operator: 'and',
        fuzziness: 'AUTO',
        prefix_length: 1
      }
    });
    should.push({ match_phrase_prefix: { name: { query: q, boost: 1.2 } } });
  } else {
    must.push({ match_all: {} });
  }

  if (category_id) {
    const cats = String(category_id).split(',').filter(Boolean);
    if (cats.length > 0) filter.push({ terms: { category_id: cats } });
  }

  const rangePrice = {};
  if (price_min != null) rangePrice.gte = Number(price_min);
  if (price_max != null) rangePrice.lte = Number(price_max);
  if (Object.keys(rangePrice).length) filter.push({ range: { price: rangePrice } });

  if (has_promo === 'true') filter.push({ range: { discount_percent: { gt: 0 } } });
  if (discount_min != null) filter.push({ range: { discount_percent: { gte: Number(discount_min) } } });
  if (views_min != null) filter.push({ range: { views: { gte: Number(views_min) } } });

  return { must, should, filter };
};

const buildSort = (sort) => {
  switch (sort) {
    case 'price_asc': return [{ price: 'asc' }];
    case 'price_desc': return [{ price: 'desc' }];
    case 'discount_desc': return [{ discount_percent: 'desc' }];
    case 'views_desc': return [{ views: 'desc' }];
    default: return ['_score', { id: 'desc' }];
  }
};

const searchProducts = async (params) => {
  if (!es) return { items: [], total: 0, page: 1, limit: parseInt(params.limit || 10) }; // ES disabled fallback
  await ensureIndex();

  const page = Math.max(1, parseInt(params.page || 1));
  const limit = Math.min(50, Math.max(1, parseInt(params.limit || 10)));
  const from = (page - 1) * limit;

  const { must, should, filter } = buildEsQuery(params);
  const sort = buildSort(params.sort);

  const body = {
    query: {
      function_score: {
        query: { bool: { must, should, filter } },
        boost_mode: 'sum',
        score_mode: 'sum',
        functions: [
          { field_value_factor: { field: 'discount_percent', factor: 1.0, missing: 0 } },
          { field_value_factor: { field: 'views', modifier: 'log1p', factor: 1.0, missing: 0 } }
        ]
      }
    },
    sort,
    from,
    size: limit
  };

  const result = await es.search({ index: INDEX_ALIAS, ...body });
  const hits = result.hits?.hits || [];
  const total = (typeof result.hits?.total === 'object') ? result.hits.total.value : (result.hits?.total || 0);

  return {
    items: hits.map(h => ({ id: h._source.id, ...h._source })),
    total,
    page,
    limit
  };
};

const bulkIndexProducts = async (products) => {
  if (!es) return { indexed: 0 }; // ES disabled
  await ensureIndex();
  if (!Array.isArray(products) || products.length === 0) return { indexed: 0 };

  const operations = products.flatMap(p => [
    { index: { _index: INDEX_ALIAS, _id: p.id } },
    {
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image,
      category_id: String(p.category_id),
      price: Number(p.price),
      stock: p.stock,
      status: p.status,
      discount_percent: Number(p.discount_percent || 0),
      views: Number(p.views || 0),
      tags: p.tags || []
    }
  ]);

  const resp = await es.bulk({ refresh: true, operations });
  if (resp.errors) {
    const failed = resp.items.filter(i => i.index && i.index.error);
    console.error('Bulk index errors:', failed.slice(0, 3));
  }
  return { indexed: products.length };
};

const indexProduct = async (product) => {
  if (!es) return; // ES disabled
  await ensureIndex();
  await es.index({
    index: INDEX_ALIAS,
    id: String(product.id),
    document: {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      category_id: String(product.category_id),
      price: Number(product.price),
      stock: product.stock,
      status: product.status,
      discount_percent: Number(product.discount_percent || 0),
      views: Number(product.views || 0),
      tags: product.tags || []
    },
    refresh: true
  });
};

const deleteProduct = async (id) => {
  if (!es) return; // ES disabled
  await ensureIndex();
  await es.delete({ index: INDEX_ALIAS, id: String(id), refresh: true }).catch(() => {});
};

module.exports = {
  searchProducts,
  bulkIndexProducts,
  indexProduct,
  deleteProduct
};



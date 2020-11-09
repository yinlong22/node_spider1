const Redis = require('ioredis');

const redis = new Redis();

const BILI_ID_SET_REDIS_KEY = 'bili_id_set';
const BILI_ARTICLE_GOT_ID_SET = 'bili_article_got_id_set';

async function generateBiliToRedis(min, max) {
  for (let i = min; i < max; i++) {
    const arr = new Array(10000);
    for (let j = 0; j < 10000; j++) {
      arr.push(i * 10000 + j);
    }
    await redis.sadd(BILI_ID_SET_REDIS_KEY, ...arr);
  }
}

async function getRandomBiliIds(count) {
  return await redis.spop(BILI_ID_SET_REDIS_KEY, count);
}

async function markArticleIdSucceed(id) {
  await redis.sadd(BILI_ARTICLE_GOT_ID_SET, id);
}

async function idBackInPool(id) {
  await redis.sadd(BILI_ID_SET_REDIS_KEY, id);
}

module.exports = {
  generateBiliToRedis,
  getRandomBiliIds,
  markArticleIdSucceed,
  idBackInPool,
};

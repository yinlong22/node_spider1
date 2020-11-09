const axios = require('axios');
const cheerio = require('cheerio');
const RedisService = require('./redis_service');

async function spideringArticles(count) {
  const ids = await RedisService.getRandomBiliIds(count);
  for (const id of ids) {
    await getSingleArticle(id);
    await new Promise((rsv) => {
      setTimeout(rsv, 1000);
    });
  }
}

async function getSingleArticle(id) {
  (async () => {
    const res = await axios.get(`https://www.bilibili.com/read/cv${id}`);
    const html = res.data;
    const $ = cheerio.load(html);
    console.log(html);
    const doms = $('.article-holder');
    // if (!doms) {
    // } else {
    //
    // }
    const content = [];
    doms.children()
      .map((i, c) => {
        const tagName = c.name;
        const text = $(c)
          .text();
        if (tagName === 'p') {
          content.push(text);
        } else if (tagName === 'figure') {
          const src = $(c)
            .children('img')
            .attr('data-src')
            .replace('//', '');
          content.push(src);
        }
      });
    console.log(content);
  })()
    .then(r => {
      process.exit(0);
    })
    .catch(e => {
      console.log(e);
      process.exit(1);
    });
}

module.exports = {
  spideringArticles,
};

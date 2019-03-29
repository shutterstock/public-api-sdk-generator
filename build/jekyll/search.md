---
title: Search results
keywords:
summary:
sidebar: meta_sidebar
permalink: search.html
folder: meta
toc: false
editme: false
search: exclude
---

<form action="/search.html" method="get">
  <input type="text" id="search-box" name="query" placeholder="search">
    <input type="submit" value="search">
</form>
<hr/>
<ul id="search-results"></ul>

<script>
  window.store = {
    {% for page in site.pages %}
      "{{ page.url | slugify }}": {
        "title": "{{ page.title | xml_escape }}",
        "search": "{{ page.search | xml_escape }}",
        "category": "{{ page.category | xml_escape }}",
        "content": {{ page.content | strip_html | strip_newlines | jsonify }},
        "keywords": "{{ page.keywords | join: ', ' | xml_escape }}",
        "tags": "{{ page.tags | join: ', ' | xml_escape }}",
        "url": "{{ page.url | xml_escape }}"
      }
      {% unless forloop.last %},{% endunless %}
    {% endfor %}
  };
</script>
<script src="/js/lunr.js"></script>
<script src="/js/lunr-search.js"></script>

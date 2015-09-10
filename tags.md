---
layout: page
title: Tags
permalink: tags.html
---

{% capture tags %}
  {% for tag in site.tags %}
    {{ tag[0] }}
  {% endfor %}
{% endcapture %}

{% assign sortedtags = tags | split:' ' | sort %}

{% for tag in sortedtags %}
  - {{ tag }}
  {% for post in site.tags[tag] %}
    - [{{ post.title }}]({{ site.baseurl }}{{ post.url }})
  {% endfor %}
{% endfor %}

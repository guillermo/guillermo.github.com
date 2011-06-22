---
---
GET = (url, fn) ->
	window.jsonp_requests ?= 1
	name = "jsonp_request_" + window.jsonp_requests++
	@self = this
	window[name] = (data)->
		debugger
		save(url, data)
		fn(data) 
	data = find(url)
	fn(data) if data? 
	if url.indexOf("?") < 0
		char = "?"
	else
		char = "&"
	jsonp_url = "#{url}#{ char }callback=#{name}"
	script = document.createElement 'scr'+'ipt'
	script.setAttribute 'type', 'text/javascript'
	script.setAttribute 'src', jsonp_url
	document.getElementsByTagName('head')[0].appendChild script


add_link = (id, url, text) ->
	if ul = document.getElementById(id)
		a = document.createElement 'a'
		a.innerText = text
		a.setAttribute 'href', url
		li = document.createElement 'li'
		li.appendChild a
		ul.appendChild li
		
clear_links = (id) ->
	ul = document.getElementById(id)
	if ul? && ul.hasChildNodes()
		for child in ul.childNodes
			ul.removeChild child
		
save = (key, value) ->
	if window.localStorage?
		localStorage[key] = JSON.stringify value
		
find = (key) ->
	value = null
	if window.localStorage?	
		try
			value = JSON.parse localStorage[key]
		catch error
			window.console.debug error
	return value
		
tumblr = (data) ->
	return unless data?
	clear_links "notes"
	for note in data["posts"][0...3]	
		field = switch note.type
			when "regular", "conversation", "video" then 'title'
			when "photo", "audio" then 'caption'
			when "quote" then 'quote'
			when "link" then 'text'
		field = "#{note.type}-#{field}"
		add_link "notes", "http://mininotas.cientifico.net/posts/#{note['id']}", note[field] 
	
twitter = (data) ->
	return unless data?
	clear_links "tweets"
	add_link "tweets", "http://twitter.com/#!/guillermooo/status/#{tweet.id_str}", tweet.text for tweet in data


GET("http://mininotas.cientifico.net/api/read/json", tumblr)
GET("http://twitter.com/status/user_timeline/guillermooo.json?count=3", twitter)

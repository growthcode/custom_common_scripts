FormHelpers = function createNewPerson(){}
FormHelpers.prototype.date_tag = function(name, value , html_options) {
  if(! (value instanceof Date))
	value = new Date()

	var month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var years = [], months = [], days =[];
	var year = value.getFullYear();
	var month = value.getMonth();
	var day = value.getDate();
	for(var y = year - 15; y < year+15 ; y++)
	{
		years.push({value: y, text: y})
	}
	for(var m = 0; m < 12; m++)
	{
		months.push({value: (m), text: month_names[m]})
	}
	for(var d = 0; d < 31; d++)
	{
		days.push({value: (d+1), text: (d+1)})
	}
	var year_select = this.select_tag_deprecated(name+'[year]', year, years, {id: name+'[year]'} )
	var month_select = this.select_tag_deprecated(name+'[month]', month, months, {id: name+'[month]'})
	var day_select = this.select_tag_deprecated(name+'[day]', day, days, {id: name+'[day]'})

  return year_select+month_select+day_select;
}

FormHelpers.prototype.form_tag = function(action, html_options) {
  html_options = html_options || {};
	html_options.action = action
  if(html_options.multipart == true) {
      html_options.method = 'post';
      html_options.enctype = 'multipart/form-data';
  }

  return this.start_tag_for('form', html_options)
}

FormHelpers.prototype.form_tag_end = function() { return this.tag_end('form'); }

FormHelpers.prototype.hidden_field_tag   = function(name, value, html_options) {
    return this.input_field_tag(name, value, 'hidden', html_options);
}

FormHelpers.prototype.input_field_tag = function(name, value , inputType, html_options) {

    html_options = html_options || {};
    html_options.id  = html_options.id  || name;
    html_options.value = value || '';
    html_options.type = inputType || 'text';
    html_options.name = name;

    return this.single_tag_for('input', html_options)
}

FormHelpers.prototype.check_box_tag = function(name, value, checked, html_options) {
  html_options = html_options || {};
  if (checked == 'true' || checked == true || checked == 'checked') {
    html_options.checked = 'checked'
  }
  return this.input_field_tag(name, value, 'checkbox', html_options)
}

FormHelpers.prototype.radio_button_tag = function(name, value, checked, html_options) {
  html_options = html_options || {};
  if (checked == 'true' || checked == true || checked == 'checked') {
    html_options.checked = 'checked'
  }
  return this.input_field_tag(name, value, 'radio', html_options)
}

FormHelpers.prototype.file_field_tag = function(name, value, html_options) {
    html_options
    return this.input_field_tag(name, value, 'file', html_options)
}

FormHelpers.prototype.is_current_page = function(url) {
	return (window.location.href == url || window.location.pathname == url ? true : false);
}

FormHelpers.prototype.link_to = function(name, url, html_options) {
    if(!name) var name = 'null';
    if(!html_options) var html_options = {}

	if(html_options.confirm){
		html_options.onclick =
		" var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} "
		html_options.confirm = null;
	}
    html_options.href=url
    return this.start_tag_for('a', html_options)+name+ this.tag_end('a');
}

FormHelpers.prototype.submit_link_to = function(name, url, html_options){
	if(!name) var name = 'null';
    if(!html_options) var html_options = {}
    html_options.onclick = html_options.onclick  || '' ;

	if(html_options.confirm){
		html_options.onclick =
		" var ret_confirm = confirm(\""+html_options.confirm+"\"); if(!ret_confirm){ return false;} "
		html_options.confirm = null;
	}

    html_options.value = name;
	html_options.type = 'submit'
    html_options.onclick=html_options.onclick+
		(url ? this.url_for(url) : '')+'return false;';
    //html_options.href='#'+(options ? Routes.url_for(options) : '')
	return this.start_tag_for('input', html_options)
}

FormHelpers.prototype.link_to_if = function(condition, name, url, html_options, post, block) {
	return this.link_to_unless((condition == false), name, url, html_options, post, block);
}

FormHelpers.prototype.link_to_unless = function(condition, name, url, html_options, block) {
	html_options = html_options || {};
	if(condition) {
		if(block && typeof block == 'function') {
			return block(name, url, html_options, block);
		} else {
			return name;
		}
	} else
		return this.link_to(name, url, html_options);
}

FormHelpers.prototype.link_to_unless_current = function(name, url, html_options, block) {
	html_options = html_options || {};
	return this.link_to_unless(this.is_current_page(url), name, url, html_options, block)
}

FormHelpers.prototype.password_field_tag = function(name, value, html_options) { return this.input_field_tag(name, value, 'password', html_options); }

FormHelpers.prototype.options_for_select = function(choices, selected) {
  var parsed_choices = []
  var txt = ''

  num_of_choices = (choices.constructor === Object) ? Object.keys(choices).length : choices.length

  if(num_of_choices > 0) {
    if(choices.constructor === Object) {
      Object.keys(choices).forEach(function(key) {
        parsed_choices.push({
          text: key,
          value: choices[key],
        })
      });
    } else if (choices.constructor === Array) {
      choices.forEach(function(element) {
        if(element.constructor === Array && element.length === 2) {
          parsed_choices.push({
            text: element[0],
            value: element[1],
          })
        } else {
          parsed_choices.push({
            text: element,
            value: element,
          })
        }
      });
    }

    for(var i = 0; i < num_of_choices; i++) {
      var choice = parsed_choices[i];
      var optionOptions = {value: choice.value}
      if (choice.value == selected) {
        optionOptions.selected ='selected'
      }
      txt += this.start_tag_for('option', optionOptions )+choice.text+this.tag_end('option')
    }
  }
  return txt;
}

// Use `#options_for_select` to generate `option_tags`
FormHelpers.prototype.select_tag = function(name, options_for_select, html_options) {
  html_options = html_options || {};
  html_options.id  = html_options.id  || name;
  html_options.name = name;

  var txt = ''
  txt += this.start_tag_for('select', html_options)
  txt += options_for_select
  txt += this.tag_end('select');
  return txt;
}

FormHelpers.prototype.select_tag_deprecated = function(name, value, choices, html_options) {
  // Use `#options_for_select` && `select_tag` instead
  html_options = html_options || {};
  html_options.id  = html_options.id  || name;
  html_options.value = value;
	html_options.name = name;

  var txt = ''
  txt += this.start_tag_for('select', html_options)

  for(var i = 0; i < choices.length; i++)
  {
      var choice = choices[i];
      var optionOptions = {value: choice.value}
      if(choice.value == value)
          optionOptions.selected ='selected'
      txt += this.start_tag_for('option', optionOptions )+choice.text+this.tag_end('option')
  }
  txt += this.tag_end('select');
  return txt;
}

FormHelpers.prototype.single_tag_for = function(tag, html_options) { return this.tag(tag, html_options, '/>');}

FormHelpers.prototype.start_tag_for = function(tag, html_options)  { return this.tag(tag, html_options); }

FormHelpers.prototype.submit_tag = function(name, html_options) {
    html_options = html_options || {};
    //html_options.name  = html_options.id  || 'commit';
    html_options.type = html_options.type  || 'submit';
    html_options.value = name || 'Submit';
    return this.single_tag_for('input', html_options);
}

FormHelpers.prototype.tag = function(tag, html_options, end) {
    if(!end) var end = '>'
    var txt = ' '
    for(var attr in html_options) {
	   if(html_options[attr] != null)
        var value = html_options[attr].toString();
       else
        var value=''
       if(attr == "Class") // special case because "class" is a reserved word in IE
        attr = "class";
       if( value.indexOf("'") != -1 )
            txt += attr+'=\"'+value+'\" '
       else
            txt += attr+"='"+value+"' "
    }
    return '<'+tag+txt+end;
}

FormHelpers.prototype.tag_end = function(tag) { return '</'+tag+'>'; }

FormHelpers.prototype.text_area_tag = function(name, value, html_options) {
    html_options = html_options || {};
    html_options.id  = html_options.id  || name;
    html_options.name  = html_options.name  || name;
	value = value || ''
    if(html_options.size) {
        html_options.cols = html_options.size.split('x')[0]
        html_options.rows = html_options.size.split('x')[1];
        delete html_options.size
    }

    html_options.cols = html_options.cols  || 50;
    html_options.rows = html_options.rows  || 4;

    return  this.start_tag_for('textarea', html_options)+value+this.tag_end('textarea')
}
FormHelpers.prototype.text_tag = FormHelpers.prototype.text_area_tag

FormHelpers.prototype.text_field_tag = function(name, value, html_options) {
  return this.input_field_tag(name, value, 'text', html_options);
}

FormHelpers.prototype.url_for = function(url) {
        return 'window.location="'+url+'";'
}
FormHelpers.prototype.img_tag = function(image_location, alt, options){
  options = options || {};
  options.src = image_location
  options.alt = alt
  return this.single_tag_for('img', options)
}
FormHelpers.prototype.image_tag = function(image_location, alt, options){
	options = options || {};
  options.src = image_location
  options.alt = alt
  return this.single_tag_for('img', options)
}

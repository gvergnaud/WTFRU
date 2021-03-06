/* 
 * Defiant.js v0.8.6 
 * Smart templating with XSLT and XPath. 
 * http://defiantjs.com 
 * 
 * Copyright (c) 2013-2014, Hakan Bilgin <hbi@longscript.com> 
 * Licensed under the MIT License 
 */ 

(function(window, document, undefined) {
	'use strict';

	var Defiant = {
		env       : 'production',
		xml_decl  : '<?xml version="1.0" encoding="utf-8"?>',
		namespace : 'xmlns:d="defiant-namespace"',
		tabsize   : 4,
		is_safari : navigator.userAgent.match(/safari/i) !== null,
		render: function(template, data) {
			var processor = new XSLTProcessor(),
				span      = document.createElement('span'),
				opt       = {match: '/'},
				scripts,
				temp;
			// handle arguments
			switch (typeof(template)) {
				case 'object':
					this.extend(opt, template);
					if (!opt.data) opt.data = data;
					break;
				case 'string':
					opt.template = template;
					opt.data = data;
					break;
				default:
					throw 'error';
			}
			opt.data = JSON.toXML(opt.data);

			if (!this.xsl_template) this.gather_templates();

			temp = this.xsl_template.selectSingleNode('//xsl:template[@name="'+ opt.template +'"]');
			temp.setAttribute('match', opt.match);
			processor.importStylesheet(this.xsl_template);
			span.appendChild(processor.transformToFragment(opt.data, document));
			temp.removeAttribute('match');

			if (this.is_safari) {
				scripts = span.getElementsByTagName('script');
				for (var i=0, il=scripts.length; i<il; i++) scripts[i].defer = true;
			}
			return span.innerHTML;
		},
		gather_templates: function() {
			var scripts = document.getElementsByTagName('script'),
				str     = '',
				i       = 0,
				il      = scripts.length;
			for (; i<il; i++) {
				if (scripts[i].type === 'defiant/xsl-template') str += scripts[i].innerHTML;
			}
			this.xsl_template = this.xmlFromString('<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" '+ this.namespace +'>'+ str.replace(/defiant:(\w+)/g, '$1') +'</xsl:stylesheet>');
		},
		xmlFromString: function(str) {
			var parser,
				xmlDoc;
			str = str.replace(/>\s{1,}</g, '><');
			if (str.match(/<\?xml/) === null) str = this.xml_decl + str;
			if (window.DOMParser) {
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(str, 'text/xml');
			} else {
				// Internet Explorer
				xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(str);
			}
			return xmlDoc;
		},
		extend: function(safe, deposit) {
			for (var content in deposit) {
				if (!safe[content] || typeof(deposit[content]) !== 'object') {
					safe[content] = deposit[content];
				} else {
					this.extend(safe[content], deposit[content]);
				}
			}
			return safe;
		},
		result: function() {
			var Q = function(found) {
				var coll = Object.create(Array.prototype);
				for (var method in Q.prototype) {
					if (Q.prototype.hasOwnProperty(method)) {
						coll[method] = Q.prototype[method];
					}
				}
				for (var i=0, il=found.length; i<il; i++) {
					coll.push(found[i]);
				}
				return coll;
			};
			Q.prototype = {
				toArray: function() {
					return Array.prototype.slice.call(this, 0);
				},
				sum: function(key) {
					var i = 0,
						il = this.length,
						sum = 0;
					for (; i<il; i++) {
						sum += +this[i][key];
					}
					return sum;
				},
				avg: function(key) {
					return this.sum(key) / this.length;
				},
				min: function(key, method) {
					var i = 0,
						il = this.length,
						arr = [];
					for (; i<il; i++) {
						arr.push(this[i][key]);
					}
					return Math[ method || 'min' ].apply(null, arr);
				},
				max: function(key) {
					return this.min(key, 'max');
				},
				add: function(key, val, operator) {
					var i = 0,
						il = this.length;
					for (; i<il; i++) {
						switch (operator) {
							case 'divide':   this[i][key] /= +val; break;
							case 'multiply': this[i][key] *= +val; break;
							case 'subtract': this[i][key] -= +val; break;
							default: this[i][key] += +val;
						}
					}
					return this;
				},
				subtract: function(key, val) {
					return this.add(key, val, 'subtract');
				},
				divide: function(key, val) {
					return this.add(key, val, 'divide');
				},
				multiply: function(key, val) {
					return this.add(key, val, 'multiply');
				},
				each: function(fn) {
					var i = 0,
						il = this.length;
					for (; i<il; i++) {
						fn(this[i]);
					}
					return this;
				}
			};
			return new Q(arguments[0]);
		}
	};

	window.Defiant = Defiant;

})(window, document);


// extending STRING
if (!String.prototype.fill) {
	String.prototype.fill = function(i,c) {
		var str = this;
		c = c || ' ';
		for (; str.length<i; str+=c){}
		return str;
	};
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/gm, '');
	};
}

/* temporary (!?)
 * - used to visual matching of search results
 */
if (!String.prototype.count_nl) {
	String.prototype.count_nl = function () {
		var m = this.match(/\n/g);
		return m ? m.length : 0;
	};
}
if (!String.prototype.notabs) {
	String.prototype.notabs = function () {
		return this.replace(/\t/g, '');
	};
}


if (!Document.selectNodes) {
	Document.prototype.selectNodes = function(XPath, XNode) {
		if (!XNode) XNode = this;
		this.ns = this.createNSResolver(this.documentElement);
		this.qI = this.evaluate(XPath, XNode, this.ns, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var res = [],
			i   = 0,
			il  = this.qI.snapshotLength;
		for (; i<il; i++) {
			res.push( this.qI.snapshotItem(i) );
		}
		return res;
	};
}

if (!Node.selectNodes) {
	Node.prototype.selectNodes = function(XPath) {
		return this.ownerDocument.selectNodes(XPath, this);
	};
}


if (!Document.selectSingleNode) {
	Document.prototype.selectSingleNode = function(XPath, XNode) {
		if (!XNode) XNode = this;
		this.xI = this.selectNodes(XPath, XNode);
		return (this.xI.length > 0)? this.xI[0] : null;
	};
}

if (!Node.selectSingleNode) {
	Node.prototype.selectSingleNode = function(XPath) {
		return this.ownerDocument.selectSingleNode(XPath, this);
	};
}


if (!Node.xml) {
	Node.prototype.__defineGetter__('xml',  function() {
		var tabs = Defiant.tabsize,
			decl = Defiant.xml_decl.toLowerCase(),
			ser  = new XMLSerializer(),
			xstr = ser.serializeToString(this);
		if (Defiant.env !== 'development') {
			// if environment is not development, remove defiant related info
			xstr = xstr.replace(/ \w+\:d=".*?"| d\:\w+=".*?"/g, '');
		}
		var str    = xstr.trim().replace(/(>)\s*(<)(\/*)/g, '$1\n$2$3'),
			lines  = str.split('\n'),
			indent = -1,
			i      = 0,
			il     = lines.length,
			start,
			end;
		for (; i<il; i++) {
			if (i === 0 && lines[i].toLowerCase() === decl) continue;
			start = lines[i].match(/<[^\/]+>/g) !== null;
			end   = lines[i].match(/<\/[\w\:]+>/g) !== null;
			if (lines[i].match(/<.*?\/>/g) !== null) start = end = true;
			if (start) indent++;
			lines[i] = String().fill(indent, '\t') + lines[i];
			if (start && end) indent--;
			if (!start && end) indent--;
		}
		return lines.join('\n').replace(/\t/g, String().fill(tabs, ' '));
	});
}

if (!Node.text) {
	Node.prototype.__defineGetter__('text', function() {
		return this.textContent;
	});
	Node.prototype.__defineSetter__('text', function(s) {
		this.textContent = s;
	});
}


if (!Node.toJSON) {

	Node.prototype.toJSON = function(stringify) {
		'use strict';

		var interpret = function(leaf) {
				var obj = {},
					attr,
					type,
					item,
					childName,
					cConstr,
					childVal;

				switch (leaf.nodeType) {
					case 1:
						type = leaf.getAttribute('d:constr');
						if (type === 'Array') obj = [];

						attr = leaf.attributes;
						for (var j=0, jl=attr.length, a; j<jl; j++) {
							a = attr.item(j);
							if (a.nodeName.match(/\:d|d\:/g) !== null) continue;

							type = leaf.getAttribute('d:'+ a.nodeName);
							childVal = (type) ? window[ type ]( a.nodeValue === 'false' ? '' : a.nodeValue ) : a.nodeValue;
							obj['@'+ a.nodeName] = childVal;
						}
						break;
					case 3:
						type = leaf.parentNode.getAttribute('d:type');
						childVal = (type) ? window[ type ]( leaf.nodeValue === 'false' ? '' : leaf.nodeValue ) : leaf.nodeValue;
						obj = childVal;
						break;
				}
				if (leaf.hasChildNodes()) {
					for(var i=0, il=leaf.childNodes.length; i<il; i++) {
						item      = leaf.childNodes.item(i);
						childName = item.nodeName;
						attr      = leaf.attributes;

						if (childName === '#text') {
							cConstr = leaf.getAttribute('d:constr');
							childVal = cConstr === 'Boolean' && item.textContent === 'false' ? '' : item.textContent;

							if (!cConstr && !attr.length) obj = childVal;
							else if (cConstr && attr.length === 1) obj = window[cConstr](childVal);
							else obj[childName] = (cConstr)? window[cConstr](childVal) : childVal;
						} else {
							if (obj[childName]) {
								
								if (obj[childName].push) obj[childName].push( interpret(item) );
								else obj[childName] = [obj[childName], interpret(item)];
								continue;
							}
							cConstr = item.getAttribute('d:constr');
							switch (cConstr) {
								case 'null':
									if (obj.push) obj.push(null);
									else obj[childName] = null;
									break;
								case 'Array':
									if (item.parentNode.firstChild === item &&
										item.getAttribute('d:constr') === 'Array' && childName !== 'item') {
										obj[childName] = [interpret(item)];
									}
									else if (obj.push) obj.push( interpret(item) );
									else obj[childName] = interpret(item);
									break;
								case 'String':
								case 'Number':
								case 'Boolean':
									childVal = cConstr === 'Boolean' && item.textContent === 'false' ? '' : item.textContent;

									if (obj.push) obj.push( window[cConstr](childVal) );
									else obj[childName] = interpret(item);
									break;
								default:
									if (obj.push) obj.push( interpret( item ) );
									else obj[childName] = interpret( item );
							}
						}
					}
				}
				return obj;
			},
			node = (this.nodeType === 9) ? this.documentElement : this,
			ret = interpret(node),
			rn  = ret[node.nodeName];

		// exclude root, if "this" is root node
		if (node === node.ownerDocument.documentElement && rn && rn.constructor === Array) {
			ret = rn;
		}
		if (stringify && stringify.toString() === 'true') stringify = '\t';
		return stringify ? JSON.stringify(ret, null, stringify) : ret;
	};
}

if (!window.JSON) {
	window.JSON = {
		parse: function (sJSON) { return eval("(" + sJSON + ")"); },
		stringify: function (vContent) {
			if (vContent instanceof Object) {
				var sOutput = "";
				if (vContent.constructor === Array) {
					for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
					return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
				}
				if (vContent.toString !== Object.prototype.toString) {
					return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
				}
				for (var sProp in vContent) {
					sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ",";
				}
				return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
			}
			return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
		}
	};
}


if (!JSON.toXML) {

	// TODO:
	// handle keys that starts with an integer

	JSON.toXML = function(tree) {
		'use strict';

		var interpreter = {
				repl: function(dep) {
					for (var key in this) {
						delete this[key];
					}
					Defiant.extend(this, dep);
				},
				to_xml: function(tree) {
					var str = this.hash_to_xml(null, tree);
					//console.log(str);
					return Defiant.xmlFromString(str);
				},
				hash_to_xml: function(name, tree, array_child) {
					var is_array = tree.constructor === Array,
						elem = [],
						attr = [],
						key,
						val,
						val_is_array,
						type,
						is_attr,
						cname,
						constr;

					for (key in tree) {
						val     = tree[key];
						if (val === null || val.toString() === 'NaN') val = null;

						is_attr = key.slice(0,1) === '@';
						cname   = array_child ? name : key;
						cname   = (cname == +cname) ? 'item' : cname;
						constr  = val === null ? null : val.constructor;

						if (is_attr) {
							attr.push( cname.slice(1) +'="'+ this.escape_xml(val) +'"' );
							if (constr.name !== 'String') attr.push( 'd:'+ cname.slice(1) +'="'+ constr.name +'"' );
						} else if (val === null) {
							elem.push( this.scalar_to_xml( cname, val ) );
						} else {
							switch (constr) {
								case Object:
									elem.push( this.hash_to_xml( cname, val ) );
									break;
								case Array:
									if (key === cname) {
										val_is_array = val.constructor === Array;
										if (val_is_array) {
											for (var i=0, il=val.length; i<il; i++) {
												if (val[i].constructor === Array) val_is_array = true;
												if (!val_is_array && val[i].constructor === Object) val_is_array = true;
											}
										}
										elem.push( this.scalar_to_xml( cname, val, val_is_array ) );
										break;
									}
								case String:
									if (typeof(val) === 'string') val = val.toString().replace(/\&/g, '&amp;');
								case Number:
								case Boolean:
									if (cname === '#text' && constr.name !== 'String') attr.push('d:constr="'+ constr.name +'"');
									elem.push( this.scalar_to_xml( cname, val ) );
									break;
								default:
									//console.log( val.constructor, key, val );
									throw 'ERROR! '+ key;
							}
						}
					}
					
					if (!name) {
						name = 'data';
						attr.push(Defiant.namespace);
						if (is_array) attr.push('d:constr="Array"');
					}

					if (array_child) return elem.join('');

					return '<'+ name + (attr.length ? ' '+ attr.join(' ') : '') + (elem.length ? '>'+ elem.join('') +'</'+ name +'>' : '/>' );
				},
				scalar_to_xml: function(name, val, override) {
					var text,
						attr,
						constr;

					if (val === null || val.toString() === 'NaN') val = null;
					if (val === null) return '<'+ name +' d:constr="null"/>';
					if (override) return this.hash_to_xml( name, val, true );

					constr = val.constructor;
					text = (constr === Array)   ? this.hash_to_xml( 'item', val, true )
												: this.escape_xml(val);

					attr = ' d:constr="'+ (constr.name) +'"';
					if ( (constr.name) === 'String' ) attr = '';

					return (name === '#text') ? this.escape_xml(val) : '<'+ name + attr +'>'+ text +'</'+ name +'>';
				},
				escape_xml: function(text) {
					return String(text) .replace(/</g, '&lt;')
										.replace(/>/g, '&gt;')
										.replace(/"/g, '&quot;');
				}
			},
			doc = interpreter.to_xml.call(interpreter, tree);

		interpreter.repl.call(tree, doc.documentElement.toJSON());

		return doc;
	};
}


if (!JSON.search) {
	JSON.search = function(tree, xpath, single) {
		'use strict';
		
		var doc  = JSON.toXML(tree),
			od   = doc.documentElement,
			xres = doc[ single ? 'selectSingleNode' : 'selectNodes' ](xpath),
			jres = [],
			ret  = [],
			map,
			node,
			map_index,
			item_map,
			current,
			is_attr,
			do_search = function(current) {
				if (map_index === jres[i].length) return current;
				switch (current.constructor) {
					case Array:
						for (var jl = current.length, j = 0, check; j<jl; j++) {
							if (item_map.val === JSON.stringify(current[j], null, '\t')) {
								if (map_index < jres[i].length) {
									map_index++;
									item_map = jres[i][map_index];
									return do_search( current[j] );
								}
							}
						}
						if (j === jl) {
							if (item_map.val === JSON.stringify(current, null, '\t')) {
								map_index++;
								item_map = jres[i][map_index];

								for (j=0; j<jl; j++) {
									check = do_search( current[j] );
									if (check) return check;
								}
							}
							return current;
						}
						break;
					default:
						current = current[item_map.key];
						if (typeof(current) !== 'object') {
							map_index++;
							item_map = jres[i][map_index];
							return current;
						}
						if (current.constructor === Object) {
							map_index++;
							item_map = jres[i][map_index];
						}
				}
				return do_search( current );
			};

		if (single) xres = [xres];
		//console.log( 'x-RES:', xres );
		for (i=0, il=xres.length; i<il; i++) {
			map  = [];
			node = xres[i];
			// can't access json "root"
			if (node === od) continue;
			while (node !== od) {
				is_attr = node.nodeType === 2;
				map.push({
					node : node,
					key  : (is_attr ? '@' : '') + node.nodeName,
					val  : is_attr ? node.value : node.toJSON('\t')
				});
				node = is_attr ? node.ownerElement : node.parentNode;
			}
			jres.push(map.reverse());
		}
		//console.log( 'j-RES:', jres );
		for (var i=0, il=jres.length; i<il; i++) {
			map_index  = 0;
			item_map   = jres[i][map_index];
			ret.push( do_search(tree) );
		}
		// if tracing is enabled
		this.trace = JSON.search.trace ? JSON.mtrace(tree, jres) : false;

		//console.log( 'RES:', ret );
		return Defiant.result(ret);
	};
}


if (!JSON.mtrace) {
	JSON.mtrace = function(root, map) {
		'use strict';

		var trace = [],
			sroot = JSON.stringify( root, null, '\t' ).notabs(),
			mroot,
			mrow,
			mlen,
			is_leaf,
			char_index,
			line_index,
			line_length;

		for (var i=0, il=map.length; i<il; i++) {
			mrow       = map[i];
			char_index = 0;
			mroot      = sroot;
			mlen       = mrow.length;
			is_leaf    = mrow[mlen-1].val.match(/[\{\}:\[\]]/g) === null;

			if (is_leaf) mlen--;
			if (mrow[0].val.notabs() !== sroot && mlen > 0) {
				mroot = mrow[0].val.notabs();
				char_index += sroot.indexOf( mroot );
			}
			for (var j=0, jl=mlen; j<jl; j++) {
				char_index += mroot.indexOf( mrow[j].val.notabs() );
				mroot = mrow[j].val.notabs();
			}
			if (is_leaf) {
				char_index += mroot.indexOf( '"'+ mrow[j].key +'": ' );
			}
			line_index  = sroot.slice( 0, char_index ).count_nl()+1;
			line_length = mrow[ is_leaf ? mlen : mlen-1  ].val.count_nl();
			trace.push( [line_index, line_length] );
		}
		return trace;
	};
}


// check if jQuery is present
if (typeof(jQuery) !== 'undefined') {
	(function ( $ ) {
		'use strict';

		$.fn.defiant = function(template, xpath) {
			this.html( Defiant.render(template, xpath) );
			return this;
		};

	}(jQuery));
}

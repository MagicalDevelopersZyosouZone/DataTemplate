window.HTMLTemplate = (function (HTMLTemplate)
{
    HTMLTemplate = HTMLTemplate || function (dom)
    {

    };
    var globalTemplates = (function ()
    {
        var list = [];
        list.add = function (template)
        {
            this[this.length] = template;
            return this.length - 1;
        }
        list.remove = function (template)
        {
            var index = this.indexOf(template);
            if (index < 0)
                return;
            for (var i = index ; i < this.length - 1 ; i++)
            {
                if (i < 0)
                    return;
                this[i] = this[i] + 1;
            }
            this.length--;
            return index;
        }
        list.removeAt = function (index)
        {
            if (index < 0)
                return;
            var obj = this[index];
            for (var i = index ; i < this.length - 1 ; i++)
            {
                if (i < 0)
                    return;
                this[i] = this[i] + 1;
            }
            this.length--;
            return obj;
        }
        return list;
    })();
    function Template(dom)
    {
        this.dom = dom;
        this.attr = [];
        this.children = [];
        this.dataSouceBinding = null;
        this.present = document.createElement("div");
        this.present.className = "HTMLTemplatePresentation";
        this.present.id = dom.id;
        this.present.template = this;

        var dataSource = null;

        var template = this;
        Object.defineProperty(this, "dataSource", {
            get: function ()
            {
                return dataSource;
            },
            set: function (value)
            {
                dataSource = value;
                template.render(template.present, value);
            }
        });
        Object.defineProperty(this.present, "dataSource", {
            get: function ()
            {
                return dataSource;
            },
            set: function (value)
            {
                dataSource = value;
                template.render(template.present, value);
            }
        });
        
        for (var i = 0; i <dom.attributes &&  dom.attributes.length; i++)
        {
            if (dom.attributes[i].name == "datasource")
            {
                this.dataSouceBinding = dom.attributes[i].value;
            }
            else
            {
                this.attr[this.attr.length] = new AttributeTemplate(dom.attributes[i]);
            }
        }
        for (var i = 0; i < dom.childNodes.length; i++)
        {
            var child = dom.childNodes[i];
            if (child.nodeName == "#text")
            {
                this.children[this.children.length] = new TextTemplate(child.wholeText);
            }
            else if (child.nodeName == "TEMPLATE")
            {
                this.children[this.children.length] = new Template(child);
            }
            else
            {
                this.children[this.children.length] = new NodeTemplate(child);
            }
        }
        dom.parentNode.replaceChild(this.present, dom);
    }
    Template.prototype.render = function (presentNode,source)
    {
        presentNode.innerHTML = "";
        if (source instanceof Array)
        {
            for (var idx = 0; idx < source.length; idx++)
            {
                var node = document.createElement("div");
                for (var i = 0; i < this.attr.length; i++)
                {
                    node.setAttributeNode(this.attr[i].render(source[idx]));
                }
                node.classList.add("HTMLTemplateNode");
                for (var i = 0; i < this.children.length; i++)
                {
                    if (this.children[i] instanceof Template)
                    {
                        var present = document.createElement("div");
                        for (var j = 0; j < this.children[i].attr.length; j++)
                        {
                            present.setAttributeNode(this.children[i].attr[j].render(source[idx]));
                        }
                        present.className = "HTMLTemplatePresentation";
                        node.appendChild(present);
                        if (!this.children[i].dataSouceBinding)
                            continue;
                        var src = eval("source." + this.children[i].dataSouceBinding);
                        this.children[i].render(present, src);
                    }
                    else if (this.children[i] instanceof TextTemplate)
                    {
                        var textNode = document.createTextNode(this.children[i].render(source[idx]));
                        node.appendChild(textNode);
                    }
                    else
                    {
                        node.appendChild(this.children[i].render(source[idx]));
                    }
                }
                this.present.appendChild(node);
            }
        }
        else if (window.ObservableList && source instanceof ObservableList)
        {
            for (var idx = 0; idx < source.length; idx++)
            {
                var node = document.createElement("div");
                for (var i = 0; i < this.attr.length; i++)
                {
                    node.setAttributeNode(this.attr[i].render(source[idx]));
                }
                node.classList.add("HTMLTemplateNode");
                for (var i = 0; i < this.children.length; i++)
                {
                    if (this.children[i] instanceof Template)
                    {
                        var present = document.createElement("div");
                        for (var j = 0; j < this.children[i].attr.length; j++)
                        {
                            present.setAttributeNode(this.children[i].attr[j].render(source[idx]));
                        }
                        present.className = "HTMLTemplatePresentation";
                        node.appendChild(present);
                        if (!this.children[i].dataSouceBinding)
                            continue;
                        var src = eval("source." + this.children[i].dataSouceBinding);
                        this.children[i].render(present, src);
                    }
                    else if (this.children[i] instanceof TextTemplate)
                    {
                        var textNode = document.createTextNode(this.children[i].render(source[idx]));
                        node.appendChild(textNode);
                    }
                    else
                    {
                        node.appendChild(this.children[i].render(source[idx]));
                    }
                }
                this.present.appendChild(node);
            }
        }
        else 
        {
            var node = document.createElement("div");
            for (var i = 0; i < this.attr.length; i++)
            {
                node.setAttributeNode(this.attr[i].render(source));
            }
            node.classList.add("HTMLTemplateNode");
            for (var i = 0; i < this.children.length; i++)
            {
                if (this.children[i] instanceof Template)
                {
                    var present = document.createElement("div");
                    for (var j = 0; j < this.children[i].attr.length; j++)
                    {
                        present.setAttributeNode(this.children[i].attr[j].render(source));
                    }
                    present.className = "HTMLTemplatePresentation";
                    node.appendChild(present);
                    if (!this.children[i].dataSouceBinding)
                        continue;
                    var src = eval("source." + this.children[i].dataSouceBinding);
                    this.children[i].render(present, src);
                }
                else if (this.children[i] instanceof TextTemplate)
                {
                    var textNode = document.createTextNode(this.children[i].render(source));
                    node.appendChild(textNode);
                }
                else
                {
                    node.appendChild(this.children[i].render(source));
                }
            }
            this.present.appendChild(node);
        }
        
    }
    Template.prototype.toString = function ()
    {
        return "<Template>";
    }

    function NodeTemplate(dom)
    {
        this.tag = dom.localName;
        this.children = [];
        this.attr = [];
        
        for (var i = 0; dom.attributes &&  i < dom.attributes.length; i++)
        {
            this.attr[this.attr.length] = new AttributeTemplate(dom.attributes[i]);
        }
        for (var i = 0; i < dom.childNodes.length; i++)
        {
            var child = dom.childNodes[i];
            if (child.nodeName == "#text")
            {
                this.children[this.children.length] = new TextTemplate(child.wholeText);
            }
            else if (child.nodeName == "TEMPLATE")
            {
                this.children[this.children.length] = new Template(child);
            }
            else
            {
                this.children[this.children.length] = new NodeTemplate(child);
            }
        }


    }
    NodeTemplate.prototype.render = function (source)
    {
        var node = document.createElement(this.tag);
        for (var i = 0; i < this.attr.length; i++)
        {
            node.setAttributeNode(this.attr[i].render(source));
        }
        for (var i = 0; i < this.children.length; i++)
        {
            if (this.children[i] instanceof Template)
            {
                var present = document.createElement("div");
                for (var j = 0; j < this.children[i].attr.length; j++)
                {
                    present.setAttributeNode(this.children[i].attr[j].render(source));
                }
                present.className = "HTMLTemplatePresentation";
                node.appendChild(present);
                if (!this.children[i].dataSouceBinding)
                    continue;
                var src = eval("source." + this.children[i].dataSouceBinding);
                this.children[i].render(present, src);
            }
            else if (this.children[i] instanceof TextTemplate)
            {
                var textNode = document.createTextNode(this.children[i].render(source));
                node.appendChild(textNode);
            }
            else
            {
                node.appendChild(this.children[i].render(source));
            }
        }
        return node;
    }
    NodeTemplate.prototype.toString = function ()
    {
        return "<" + this.tag + ">";
    }

    function AttributeTemplate(attr)
    {
        this.name = attr.name;
        this.value = new TextTemplate(attr.value);
        this.raw = attr.name + "=" + attr.value;
    }
    AttributeTemplate.prototype.render = function (source)
    {
        var attr = document.createAttribute(this.name);
        attr.value = this.value.render(source);
        return attr;
    }
    AttributeTemplate.prototype.toString = function ()
    {
        return this.raw;
    }

    function TextTemplate(text)
    {
        this.raw = text;
        var reg = /\{[^\{\}]*\}/;
        this.combine = [];
        var part = "";
        for (var i = 0; i < text.length; i++)
        {
            if (text.charAt(i) == "{" && i + 1 < text.length && text.charAt (i+1)!= "+")
            {
                if (part.length > 0)
                {
                    this.combine[this.combine.length] = part;
                    part = "";
                }
                var bindText = "";
                for (; i < text.length; i++)
                {
                    bindText += text.charAt(i);

                    if (text.charAt(i) == "}" && i - 1 > 0 && text.charAt(i - 1) != "+")
                    {
                        break;
                    }
                }
                var bind = new Binding(bindText);
                this.combine[this.combine.length] = bind;
            }
            else
            {
                part += text.charAt(i);
            }
        }
        if (part.length)
        {
            this.combine[this.combine.length] = part;
        }
    }
    TextTemplate.prototype.render = function (source)
    {
        var text = "";
        for (var i = 0; i < this.combine.length; i++)
        {
            if (this.combine[i] instanceof Binding)
            {
                text += this.combine[i].exec(source);
            }
            else
                text += this.combine[i];
        }
        return text;
    }
    TextTemplate.prototype.toString = function ()
    {
        return this.raw;
    }

    function Binding(bindingText)
    {
        this.bind = "";

        if (/\{([_0-9a-zA-Z]+)\}/.test(bindingText))
        {
            this.bind = /\{([_0-9a-zA-Z]+)\}/.exec(bindingText)[1];
        }
        else
        {
            var data = JSON.parse(bindingText);
            this.bind = data.bind;
        }
    }
    Binding.prototype.exec = function (obj)
    {
        var text = eval("obj." + this.bind);
        return text;
    }
    function Init(templateDOM)
    {
        //Init specified template
        if (templateDOM)
        {
            //Create a div to present
            var div = document.createElement("div");
            div.className = "HTMLTemplatePresentation";
            div.id = templateDOM.id;
            div.template = templateDOM;
            templateDOM.present = div;
            templateDOM.__datasource = null;
            div.onDataSourceChanged = null;
            //Set dataSource as a property
            Object.defineProperty(div, "dataSource", {
                get: function ()
                {
                    return templateDOM.__datasource;
                },
                set: function (value)
                {
                    templateDOM.__datasource = value;
                    templateDOM.present.innerHTML = "";
                    if (templateDOM.onDataSourceChanged)
                        templateDOM.onDataSourceChanged({ target: templateDOM, data: value });
                    //List binding
                    if (value instanceof Array)
                    {
                        for (var i = 0; i < value.length; i++)
                        {
                            if (!value[i])
                                continue;
                            templateDOM.present.appendChild(RenderTemplate(templateDOM, value[i]));
                        }
                    }
                        //Single object binding
                    else
                    {
                        templateDOM.present.appendChild(RenderTemplate(templateDOM, value));
                    }

                }
            });
            //Initialized mark
            templateDOM.inited = true;
            templateDOM.parentNode.replaceChild(div, templateDOM);
            globalTemplates.add(templateDOM);
        }
        //Init all template
        else
        {
            var list = [document];
            var nextList = [];
            var templateList = [];
            //BFS search all Nodes
            function SearchChildren()
            {
                nextList = [];
                if (list.length <= 0)
                    return;
                for (var i = 0; i < list.length ; i++)
                {
                    for (var j = 0; j < list[i].childNodes.length; j++)
                    {

                        if (!list[i].childNodes[j].localName)
                            continue;
                        if (list[i].childNodes[j].localName == "template")
                        {
                            var template = new Template(list[i].childNodes[j]);
                            continue;
                            var node=new Template(list[i].childNodes[j]);
                            templateList[templateList.length] = list[i].childNodes[j];
                        }
                        else
                            nextList[nextList.length] = list[i].childNodes[j];
                    }
                }
                list = nextList;
                SearchChildren();
            }
            SearchChildren();


            //Init Templates
            for (var i = 0; i < templateList.length ; i++)
            {
                Init(templateList[i]);
            }
        }
        
    }
    HTMLTemplate.Init = Init;

    function RenderTemplate(template, obj)
    {
        if (!template.inited)
            throw new Error("Template has not initialized.");
        if (!obj)
            obj = {};
        var html = template.innerHTML.toString();
        var reg = /\{\s*(\S+)\s*\}/;
        for (var match = reg.exec(html) ; match; match = reg.exec(html))
        {
            if (match.length < 2)
                continue;
            var key = match[1];
            html = html.replace("{" + key + "}", obj[key]);
        }
        html = html.replace("{+", "{");
        html = html.replace("+}", "}");
        var div = document.createElement("div");
        div.className = "HTMLTemplateNode "+template.className;
        div.innerHTML = html;
        return div;
    }
    HTMLTemplate.RenderTemplate = RenderTemplate;

    return HTMLTemplate;
})(window.HTMLTemplate);
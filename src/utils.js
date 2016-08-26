export class Utils {
    // usage example deepExtend({}, objA, objB); => should work similar to $.extend(true, {}, objA, objB);
    static deepExtend(out) {

        var utils = this;
        var emptyOut = {};


        if (!out && arguments.length > 1 && Array.isArray(arguments[1])) {
            out = [];
        }
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (!source)
                continue;

            for (var key in source) {
                if (!source.hasOwnProperty(key)) {
                    continue;
                }
                var isArray = Array.isArray(out[key]);
                var isObject = utils.isObject(out[key]);
                var srcObj = utils.isObject(source[key]);

                if (isObject && !isArray && srcObj) {
                    utils.deepExtend(out[key], source[key]);
                } else {
                    out[key] = source[key];
                }
            }
        }

        return out;
    };

    static mergeDeep(target, source) {
        let output = Object.assign({}, target);
        if (Utils.isObjectNotArray(target) && Utils.isObjectNotArray(source)) {
            Object.keys(source).forEach(key => {
                if (Utils.isObjectNotArray(source[key])) {
                    if (!(key in target))
                        Object.assign(output, {[key]: source[key]});
                    else
                        output[key] = Utils.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, {[key]: source[key]});
                }
            });
        }
        return output;
    }

    static cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    };

    static inferVariables(data, groupKey, includeGroup) {
        var res = [];
        if (data.length) {
            var d = data[0];
            if (d instanceof Array) {
                res = d.map(function (v, i) {
                    return i;
                });
            } else if (typeof d === 'object') {

                for (var prop in d) {
                    if (!d.hasOwnProperty(prop)) continue;

                    res.push(prop);
                }
            }
        }
        if (!includeGroup) {
            var index = res.indexOf(groupKey);
            if (index > -1) {
                res.splice(index, 1);
            }
        }
        return res
    };

    static isObjectNotArray(item) {
        return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };

    static isObject(a) {
        return a !== null && typeof a === 'object';
    };

    static isNumber(a) {
        return !isNaN(a) && typeof a === 'number';
    };

    static isFunction(a) {
        return typeof a === 'function';
    };

    static insertOrAppendSelector(parent, selector, operation, before) {
        var selectorParts = selector.split(/([\.\#])/);
        var element = parent[operation](selectorParts.shift(), before);//":first-child"
        while (selectorParts.length > 1) {
            var selectorModifier = selectorParts.shift();
            var selectorItem = selectorParts.shift();
            if (selectorModifier === ".") {
                element = element.classed(selectorItem, true);
            } else if (selectorModifier === "#") {
                element = element.attr('id', selectorItem);
            }
        }
        return element;
    }

    static insertSelector(parent, selector, before) {
        return Utils.insertOrAppendSelector(parent, selector, "insert", before);
    }

    static appendSelector(parent, selector) {
        return Utils.insertOrAppendSelector(parent, selector, "append");
    }

    static selectOrAppend(parent, selector, element) {
        var selection = parent.select(selector);
        if (selection.empty()) {
            if (element) {
                return parent.append(element);
            }
            return Utils.appendSelector(parent, selector);

        }
        return selection;
    };

    static selectOrInsert(parent, selector, before) {
        var selection = parent.select(selector);
        if (selection.empty()) {
            return Utils.insertSelector(parent, selector, before);
        }
        return selection;
    };

    static linearGradient(svg, gradientId, range, x1, y1, x2, y2) {
        var defs = Utils.selectOrAppend(svg, "defs");
        var linearGradient = defs.append("linearGradient")
            .attr("id", gradientId);

        linearGradient
            .attr("x1", x1 + "%")
            .attr("y1", y1 + "%")
            .attr("x2", x2 + "%")
            .attr("y2", y2 + "%");

        //Append multiple color stops by using D3's data/enter step
        var stops = linearGradient.selectAll("stop")
            .data(range);

        stops.enter().append("stop");

        stops.attr("offset", (d, i) => i / (range.length - 1))
            .attr("stop-color", d => d);

        stops.exit().remove();
    }

    static sanitizeHeight = function (height, container) {
        return (height || parseInt(container.style('height'), 10) || 400);
    };
    
    static sanitizeWidth = function (width, container) {
        return (width || parseInt(container.style('width'), 10) || 960);
    };

    static availableHeight = function (height, container, margin) {
        return Math.max(0, Utils.sanitizeHeight(height, container) - margin.top - margin.bottom);
    };

    static availableWidth = function (width, container, margin) {
        return Math.max(0, Utils.sanitizeWidth(width, container) - margin.left - margin.right);
    };

    static guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
}
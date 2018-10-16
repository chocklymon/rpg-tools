/* Creates a table of contents for the page */
jQuery(function($) {
    function createTOC() {
        var loc = 0,
            $headers = $('[id]'),
            $parent = $('<div>');

        function getTag($element) {
            switch ($element.prop("tagName").toLowerCase()) {
                case 'h1':
                    return 1;
                case 'h2':
                    return 2;
                case 'h3':
                    return 3;
                case 'h4':
                    return 4;
                case 'h5':
                    return 5;
                case 'h6':
                    return 6;
                default:
                    return null;
            }
        }

        function _createTOC(parent, depth, headerLevel) {
            var header,
                tag,
                list = $('<ul>'),
                listItem = null;
            for (var i = 1; loc < $headers.length;) {
                header = $($headers[loc]);
                tag = getTag(header);
                if (tag) {
                    if (tag === headerLevel) {
                        // Same Level
                        listItem = $('<li>').append(
                            $('<a href="#' + header.attr('id') + '">' + depth + i + ': ' + header.text() + '</a>')
                        );
                        list.append(listItem);
                        i++;
                        loc++;
                    } else if (headerLevel < tag) {
                        // Descending
                        if (listItem === null) {
                            listItem = $('<li>');
                            list.append(listItem);
                        }
                        var newDepth = depth;
                        if (i === 1) {
                            newDepth += '1.'
                        } else {
                            newDepth += (i - 1) + '.';
                        }
                        _createTOC(listItem, newDepth, headerLevel + 1);
                    } else {
                        // Ascending
                        if (listItem !== null) {
                            parent.append(list);
                        }
                        return;
                    }
                } else {
                    loc++;
                }
            }

            parent.append(list);
        }

        _createTOC($parent, '', 1);
        return $parent;
    }

    var toc = createTOC();
    console.log('TOC:', toc);
    $('.toc').append($(toc));
});

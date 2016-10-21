/**
 * Copyright (c) 2012, Markus Zapke-Gründemann
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *     * Neither the names of the authors nor the names of other
 *     contributors may be used to endorse or promote products derived from
 *     this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
chart = {
    /**
     * Reference to Paper instance used to draw the chart.
     *
     * Set this before using the chart!
     */
    paper: [],
    /**
     * Draws a rectangle of the given color and adds text as label.
     *
     * width is an optional argument. If given the width of the rectangle will
     * be strechted to this width.
     */
    rect: function(text, x, y, color, width) {
        if (typeof width === 'undefined') {
            width = 0;
        }
        var word = this.paper.text(x, y, text);
        word.attr({'font-size': 36, fill: '#fff'});
        var bbox = word.getBBox();
        var rectAdd = 40;
        var rectWidth = bbox.width + rectAdd;
        var rectHeight = bbox.height + rectAdd / 2;
        var rectX = bbox.x - rectAdd / 2;
        var rectY = bbox.y - rectAdd / 4;
        if (rectWidth < width) {
            rectWidth = width;
            rectX = bbox.x - (width - bbox.width) / 2;
        }
        var rect = this.paper.rect(rectX, rectY, rectWidth, rectHeight, 10);
        rect.attr({'fill': color, 'stroke-width': 0});
        word.toFront();
        return rect;
    },
    /**
     * Draws a (single) arrow of the given size and color.
     */
    arrow: function(x1, x2, y1, y2, size, color) {
        var arrow = this.paper.path('M' + x1 + ' ' + x2 + 'L' + y1 + ' ' + y2);
        arrow.attr({
            'stroke-width': size,
            'stroke': color,
            'arrow-end': 'block-midium-long'
        });
        return arrow;
    },
    /**
     * Returns the coordinates of the given position of the element.
     *
     * Allowed positions are: top, right, bottom, left.
     * Returns always the centered position.
     */
    getCoordinates: function(el, position) {
        var bbox = el.getBBox();
        var padding = 10;
        var x, y;
        switch(position) {
            case 'top':
                x = bbox.x + bbox.width / 2;
                y = bbox.y - padding;
                break;
            case 'right':
                x = bbox.x + bbox.width + padding;
                y = bbox.y + bbox.height / 2 + padding;
                break;
            case 'bottom':
                x = bbox.x + bbox.width / 2;
                y = bbox.y + bbox.height + padding;
                break;
            case 'left':
                x = bbox.x - padding;
                y = bbox.y + bbox.height / 2;
                break;
        }
        return {x: x, y: y};
    },
    /**
     * Points an arrow of the given color from the first element to the second.
     *
     * Use the optional move argument to move the arrow horizontally.
     * move can be either a number or an Array. If move is a number both ends
     * of the arrow are moved the same distance. If move is an Array the first
     * value is used for the start of the arrow and the second for the end.
     */
    pointTo: function(el1, pos1, el2, pos2, color, move) {
        if (typeof move === 'undefined') {
            move = 0;
        }
        var start = this.getCoordinates(el1, pos1);
        var end = this.getCoordinates(el2, pos2);
        var moveStart, moveEnd;
        if (typeof move === 'number') {
            moveStart = moveEnd = move;
        } else {
            moveStart = move[0];
            moveEnd = move[1];
        }
        return this.arrow(start.x - moveStart, start.y, end.x - moveEnd, end.y, 10, color);
    },
    /**
     * Connects two elements with a double arrow.
     */
    connect: function(el1, pos1, el2, pos2, color, move) {
        var arrow = this.pointTo(el1, pos1, el2, pos2, color, move);
        arrow.attr({'arrow-start': 'block-midium-long'});
        return arrow;
    }
};

/**
 * Use this function to add a label to an element.
 *
 * alignment is optional and can be either left or right.
 * padding is optional and has to be a postive or negative integer.
 */
Raphael.el.label = function(text, color, size, alignment, padding) {
    if (typeof padding === 'undefined') {
        padding = 0;
    }
    var bbox = this.getBBox();
    var x, y;
    switch(alignment) {
        case 'left':
            x = bbox.x - padding;
            y = bbox.y + bbox.height / 2;
            break;
        case 'right':
            x = bbox.x + padding;
            y = bbox.y + bbox.height / 2;
            break;
        default:
            x = bbox.x;
            y = bbox.y;
    }
    this.paper.text(x, y, text).attr({'fill': color, 'font-size': size});
};

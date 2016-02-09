 $(document).ready(function() {

    (function( $ ) {

        $.fn.toolTipify = function(keysArray, messagesArray) {

            this.each(function() {

                var currentId = getKey(this);
                var currentMsg = getMessage(currentId, keys, messages);

                //Tool tip the tags
                $( this ).addClass( "has-tip" );
                $( this ).addClass( "tip-top" );
                $( this ).attr( "title", currentMsg);
                $( this ).attr( "data-tooltip", "" );
                $( this ).attr( "aria-haspopup", "true" );
                $( this ).attr( "data-options", "disable_for_touch:true" );
            });


        };

        // get and return the html element's id if present.
        getKey = function (that) {
            var key = $(that).attr("id");
            return key;
        };

        // get the message for the provided key.
        getMessage = function (key, keysArray, messagesArray) {
            var index = $.inArray(key, keysArray);
            return messagesArray[index];
        };

    }( jQuery ));
    
 });

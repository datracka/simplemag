/**
 * Establishes TP2WP "namespace" and creates common functionality used
 * throughout the plugin
 */
(function ($) {

    "use strict";
    window.TP2WP = {};

    /**
     * Returns a padded out version of a number, so that the string representation
     * of the number will always be a string of at least length 2. Useful
     * for doing plaintext formatting of text.  If the given number is only
     * a single digit (with no preceding decimal), the number is left padded
     * with zeros.
     *
     * @param number num
     *   A number of any length.
     *
     * @return string
     *   A string representation of the given number, of length at least two.
     */
    window.TP2WP.padDate = function (num) {
        var numAsString = num.toString();
        return (numAsString.length === 1) ? "0" + numAsString : numAsString;
    };

    /**
     * Returns a function used for logging records into a textarea element.
     * The number of displayed messages is capped. Adding another message
     * to the log after the maximum number of records has been hit
     * will remove the oldest record in the log.
     *
     * @param jQuery $log
     *   A jQuery object wrapping one or more textarea DOM nodes
     * @param number maxLogEntries
     *   The maximum number of records to include in the displayed
     *   log.  Defaults to 1,000
     *
     * @return array
     *   Returns a pair of functions.
     *
     *   The first function is for use for use when logging.  The returned
     *   function takes two arguments:
     *      - msg (string):   an arbitrary string to log
     *      - level (string): either undefined or an empty string to refer to a
     *                        standard level message, or any other given level that
     *                        will be appended to the logged message as a class
     *                        (ie log-message-[level])
     *
     *   The second function is for use when emptying the log.  This function
     *   takes no arguments, and calling it will both empty the displayed log of
     *   messages, and reset the internal state of the log.
     */
    window.TP2WP.generateLogger = function ($log, maxLogEntries) {

        var localMaxLogEntries = maxLogEntries || 1000,
            numLogEntries = 0,
            logMessage,
            clearLog;

        logMessage = function (msg, level) {

            var levelClass = level ? "class='log-message-" + level + "'" : "",
                d = new Date(),
                dateParts = [d.getHours(), d.getMinutes(), d.getSeconds()],
                dateString = $.map(dateParts, window.TP2WP.padDate).join(":"),
                dateElement = '<span class="date">' + dateString + '</span>: ';

            if (numLogEntries === localMaxLogEntries) {
                $log.children().last().remove();
            } else {
                numLogEntries += 1;
            }

            $log.prepend("<p " + levelClass + ">" + dateElement + msg + "</p>");
        };

        clearLog = function () {
            $log.children().remove();
            numLogEntries = 0;
        };

        return [logMessage, clearLog];
    };

}(jQuery));

(function ($) { $(function () {

    var TP2WP = window.TP2WP,
        nonce = $("#tp2wp-attachments-nonce").val(),

        $domainsTextarea = $("#tp2wp-domains"),
        $domainsSubmit = $("#tp2wp-update-domains"),
        currentDomains = ($.trim($domainsTextarea.val()) !== "")
            ? $domainsTextarea.val().split("\n")
            : [],

        $log = $("#tp2wp-import-log"),
        $clearLogButton = $("#tp2wp-clear-log"),
        loggingFunctions = TP2WP.generateLogger($log),
        appendToLog = loggingFunctions[0],
        clearLog = loggingFunctions[1],
        logImportResponse, // The structure of the response of a request to import
                           // a given post is a little complicated, so processing
                           // it is factored off into a seperate function to keep
                           // things cleaner

        $resetButton = $("#tp2wp-reset"),
        resetPluginState, // Resets the state of the plugin, both server and
                          // client side

        $attachmentCount = $("#tp2wp-attachment-count"),
        attachmentCount = 0,    // A count of the number of attachments that
                                // have been imported so far
        setAttachmentCount,     // Function for setting both the DOM display of,
                                // and internal store of the attachment count

        $postsProcessed = $("#tp2wp-posts-processed"),
        postsProcessed = 0, // The count of the number of posts that have
                            // been processed / parsed for attachments
        setPostsProcessed,  // Wrapper function for setting both the DOM display
                            // and JS store of the number of posts processed
                            // so far.

        $postsRemaining = $("#tp2wp-posts-remaining"),
        postsRemaining = 0, // The count of the number of posts that have not
                            // yet been parsed for attachments
        setPostsRemaining,  // Wrapper function for simultaniously updating
                            // the DOM and JS representations of the count of
                            // remaining posts

        $currentWorkDescription = $("#tp2wp-current-batch"),
        currentWork = [],   // An array of post IDs to process.
        updateCurrentWorkDesc,  // Helper function to update the current description
                                // of posts left to import
        setCurrentWork, // Wrapper fucntion for both setting the amount of work
                        // that needs to be done in JS and updating the DOM
                        // display of the same information.

        $pauseImportButton = $("#tp2wp-stop-import"),
        importIsPaused = false, // Marker to check and see if we should stop
                                // importing after the current post has been
                                // completed

        $importAllButton = $("#tp2wp-import-all"),

        fetchWorkStatus,    // Fetch the current state of the importing process
                            // via AJAX

        disableActions, // Disables all DOM elements related to starting an import
        setActionsImporting,    // Sets the state of the import buttons to reflect
                                // that the plugin is currently importing
        setActionsReady,    // Sets the state of the importing buttons to reflect
                            // that the plugin is ready to import

        importNextPost; // Pulls the next post ID of the work list and tells the
                        // extension to import it.

    disableActions = function () {
        $importAllButton.attr("disabled", "disabled");
        $pauseImportButton.attr("disabled", "disabled");
        $resetButton.attr("disabled", "disabled");
    };

    setActionsImporting = function () {
        importIsPaused = false;
        $importAllButton.attr("disabled", "disabled");
        $resetButton.attr("disabled", "disabled");
        $pauseImportButton.removeAttr("disabled");
    };

    setActionsReady = function () {
        importIsPaused = false;
        $importAllButton.removeAttr("disabled");
        $resetButton.removeAttr("disabled");
        $pauseImportButton.attr("disabled", "disabled");
    };

    setAttachmentCount = function (newCount) {
        $attachmentCount.text(newCount);
        attachmentCount = newCount;
    };

    setPostsProcessed = function (newCount) {
        $postsProcessed.text(newCount);
        postsProcessed = newCount;
    };

    setPostsRemaining = function (newCount) {
        $postsRemaining.text(newCount);
        postsRemaining = newCount;
    };

    setCurrentWork = function (newWork) {
        currentWork = newWork || [];
        updateCurrentWorkDesc();
    };

    $pauseImportButton.click(function () {
        importIsPaused = true;
        appendToLog("Pausing import process. No more work will be processed after current request is finished.");
        disableActions();
        return false;
    });

    updateCurrentWorkDesc = function () {

        var output,
            numNamedIDs = 5;

        if (currentWork.length === 0) {
            output = "No posts left to process.";
            $currentWorkDescription.text(output);
            return;
        }

        output = "Post IDs " + currentWork.slice(0, numNamedIDs).join(", ");

        if (currentWork.length > numNamedIDs) {
            output += " and <strong>" + (currentWork.length - numNamedIDs) + "</strong> other posts left to import";
        }

        $currentWorkDescription.html(output);
    };

    // When the clear log button is clicked, remove all the nodes out of the
    // log container
    $clearLogButton.click(function () {
        clearLog();
        return false;
    });

    logImportResponse = function (logImportResponses) {

        var attachmentsImportedCount = 0;

        $.each(logImportResponses, function (url, value) {

            var wasSuccessful = value[0],
                importMessage = value[1];

            if (wasSuccessful) {
                attachmentsImportedCount += 1;
                appendToLog("Successfully imported " + url + " to " + importMessage, "success");
            } else if (importMessage.indexOf("Timeout") !== -1) {
                appendToLog("Did not import " + url + ": " + importMessage, "error");
            } else {
                appendToLog("Did not import " + url + ": " + importMessage, "info");
            }
        });

        setAttachmentCount(attachmentsImportedCount + attachmentCount);
    };

    $importAllButton.click(function () {

        if (currentDomains.length === 0) {
            window.alert("Unable to start importing, you must specify and save at least one domain to look for attachments from.");
            return;
        }

        importIsPaused = false;
        disableActions();
        appendToLog("Fetching post information for posts to be imported...");

        $.post(
            ajaxurl,
            {
                security: nonce,
                action: "tp2wp_importer_attachments",
                request: "posts-ids"
            },
            function (response) {

                if (response.error) {
                    appendToLog(response.data, "error");
                    disableActions();
                    return;
                }

                appendToLog("Successfully received " + response.data.length + " post ids to import.", "success");
                setCurrentWork(response.data);
                setActionsImporting();
                importNextPost();
            },
            "json"
        );

        return false;
    });

    importNextPost = function () {

        var nextId;

        // If we've hit the pause button since the last action, just stop
        // everything and don't process further
        if (importIsPaused) {
            appendToLog("Importer was paused, so not processing further.");
            setActionsReady();
            return;
        }

        if (currentWork.length === 0) {
            appendToLog("No more work to process. All done.");
            setActionsReady();
            return;
        }

        nextId = currentWork[0];
        appendToLog("Beginning to import attachments from post " + nextId);

        $.post(
            ajaxurl,
            {
                security: nonce,
                action: "tp2wp_importer_attachments",
                request: "import",
                id: nextId
            },
            function (response) {

                if (response.error) {
                    appendToLog(response.data, "error");
                    disableActions();
                    return;
                }

                // Otherwise, we successfully processed a post's worth
                // of attachments
                logImportResponse(response.data);
                appendToLog("Finished processing post " + nextId);

                // Remove the work that was just completed
                currentWork.splice(0, 1);

                // Update the short preview of work left to complete
                updateCurrentWorkDesc();

                setPostsProcessed(postsProcessed + 1);
                setPostsRemaining(postsRemaining - 1);
                importNextPost();
            },
            "json"
        );
    };

    fetchWorkStatus = function () {

        appendToLog("Fetching importer status...");

        $.post(
            ajaxurl,
            {
                security: nonce,
                action: "tp2wp_importer_attachments",
                request: "status"
            },
            function (response) {

                if (response.error) {
                    appendToLog(response.data, "error");
                    disableActions();
                    return;
                }

                appendToLog("Successfully fetched import status.", 'success');
                setAttachmentCount(parseInt(response.data.attachments, 10));
                setPostsProcessed(parseInt(response.data.posts_processed, 10));
                setPostsRemaining(parseInt(response.data.posts_unprocessed, 10));
                setActionsReady();
            },
            "json"
        );
    };

    resetPluginState = function () {

        appendToLog("Resetting plugin state...");
        $.post(
            ajaxurl,
            {
                security: nonce,
                action: "tp2wp_importer_attachments",
                request: "reset"
            },
            function (response) {

                if (response.error) {
                    appendToLog(response.data, "error");
                    disableActions();
                    return;
                }

                appendToLog("Successfully reset importer state.");
                setAttachmentCount(0);
                setPostsProcessed(0);
                setPostsRemaining(0);
                fetchWorkStatus();
            },
            "json"
        );
    };

    $domainsSubmit.click(function () {

        var submittingDomains = $.map($domainsTextarea.val().split("\n"), function (val) {
            return $.trim(val).toLowerCase();
        });
        $domainsTextarea.val(currentDomains.join("\n"));

        appendToLog("Submitting new set of domains to watch.");
        $domainsSubmit.attr("disabled", "disabled");
        $domainsTextarea.attr("disabled", "disabled");

        $.post(
            ajaxurl,
            {
                security: nonce,
                action: "tp2wp_importer_attachments",
                request: "domains",
                domains: submittingDomains
            },
            function (response) {

                var $responseMessage;

                if (response.error) {
                    $responseMessage = $("<div class='error'>" + response.data + "</div>");
                    appendToLog(response.data, "error");
                } else {
                    $responseMessage = $("<p>Successfully updated domains list.</p>");
                    appendToLog("Successfully updated domains list.");
                    $domainsTextarea.val(response.data.join("\n"));
                    currentDomains = response.data;
                }

                $domainsSubmit.removeAttr("disabled");
                $domainsTextarea.removeAttr("disabled");
                $domainsTextarea.after($responseMessage);
                setTimeout(function () {
                    $responseMessage.fadeOut(400, function () {
                        $responseMessage.remove();
                    });
                }, 5000);
            },
            "json"
        );
        return false;
    });

    $resetButton.click(function () {
        importIsPaused = false;
        disableActions();
        resetPluginState();
        return false;
    });

    // On page load we want to instantly get the status of the plugin in
    // the server, which kicks everything off
    fetchWorkStatus();

}); }(jQuery));

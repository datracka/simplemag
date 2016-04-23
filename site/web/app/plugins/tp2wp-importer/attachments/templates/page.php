<div class="wrap">
    <?php echo tp2wp_importer_tabs( 'attachments' ); ?>
    <h2><?php echo __( 'TP2WP Importer : Attachments' ); ?></h2>

    <table class="form-table">
        <tbody>
            <tr>
                <th scope="row">
                    <?php echo __( 'Importer Details' ); ?>
                </th>
                <td>
                    <dl>
                        <dt><?php echo __( 'Attachments imported' ); ?></dt>
                        <dd><span id="tp2wp-attachment-count">-</span></dd>

                        <dt><?php echo __( 'Posts processed' ); ?></dt>
                        <dd><span id="tp2wp-posts-processed">-</span></dd>

                        <dt><?php echo __( 'Posts remaining' ); ?></dt>
                        <dd><span id="tp2wp-posts-remaining">-</span></dd>

                        <dt><?php echo __( ' Current batch' ); ?></dt>
                        <dd><span id="tp2wp-current-batch">-</span></dt>

                        <dt><?php echo __( 'Watched domains'); ?></dt>
                        <dd>
                            <p><?php echo __( 'Any files referenced in your posts served from the below domains will be imported.  Enter one domain per line, in the format <em>example.org</em>.  Do not include the protocol (ex <em>http://</em> or <em>https://</em>).' ); ?></p>
                            <textarea id="tp2wp-domains" rows="5" cols="50" class="large-text code"><?php echo implode( "\n", $domains ) ;?></textarea>

                            <p><input id="tp2wp-update-domains" class="button" value="<?php echo __( 'Update domains' ); ?>" type="submit" /></p>
                        </dd>
                    </dl>
                </td>
            </tr>

            <tr>
                <th scope="row" rowspan="3">
                    <?php echo __( 'Actions' ); ?>
                </th>
                <td>
                    <p>
                        <label for="tp2wp-import-all">
                            <?php echo __( 'Import attachments for all unprocessed posts.' ); ?>
                        </label>
                    </p>
                    <p>
                        <input id="tp2wp-import-all" class="button button-primary" value="<?php echo __( 'Import remaining posts' ); ?>" type="submit" disabled="disabled"  />
                    </p>
                </td>
            </tr>

            <tr>
                <td>
                    <p>
                        <label for="tp2wp-stop-import">
                            <?php echo __( 'Stop Import Process' ); ?>
                        </label>
                    </p>
                    <p>
                        <input id="tp2wp-stop-import" class="button button-cancel" value="<?php echo __( 'Pause import' ); ?>" type="submit" disabled="disabled" />
                    </p>
                </td>
            </tr>

            <tr>
                <td>
                    <p>
                        <label for="tp2wp-reset">
                            <?php echo __( 'Reset Import State' ); ?>
                        </label>
                    </p>
                    <p>
                        <?php echo __( 'Reset all information about which posts have been processed for attachments.  This does not affect the content of any posts, or any attachments attachments that have already been processed.'); ?>
                    </p>
                    <p>
                        <input id="tp2wp-reset" class="button" value="<?php echo __( 'Reset importer state' ); ?>" disabled="disabled" type="submit" />
                    </p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <?php echo __( 'Work Record' ); ?>
                </th>
                <td>
                    <p><?php echo __( 'A running work log of all work done to date by the importer.' ); ?></p>
                    <div id="tp2wp-import-log"> </div>
                    <p>
                        <input id="tp2wp-clear-log" class="button" value="<?php echo __( 'Clear log' ); ?>" type="submit" />
                    </p>
                    <p>
                        <strong><?php echo __( 'Note' ); ?></strong>:
                        <?php echo __( 'Only the 1000 most recent messages will be displayed.' ); ?>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<input type="hidden" id="tp2wp-attachments-nonce" value="<?php echo $nonce; ?>" />

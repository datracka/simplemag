<div class="wrap">
    <?php echo tp2wp_importer_tabs( 'status' ); ?>
    <h2><?php echo __( 'TP2WP Importer : Status' ); ?></h2>

    <p><?php echo __( 'This page performs several checks to make a best effort to determine whether your Wordpress install is optimally configured for a smooth import of your Typepad / MoveableType data.' ); ?></p>

    <p><?php echo __( 'Please note that the above checks are a only a best guess determination, as certain hosting providers and other server software can alter these values in ways that are invisible to PHP code.  Unfortunately, all passing checks below does not guarantee success in your import.' ); ?></p>

    <table class="tp2wp-status-check">
        <thead>
            <tr>
                <th><?php echo __( 'Check' ); ?></th>
                <th><?php echo __( 'Result' ); ?></th>
                <th><?php echo __( 'Description' ); ?></th>
            </tr>
        </thead>
        <tbody>

            <?php // Memory configuration check ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Memory limit' ); ?>
                </th>
                <?php if ( $current_mem_limit_bytes < $ideal_mem_limit_bytes ): ?>
                    <td class="error result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="error">
                        <p>
                            <?php echo __( 'Your PHP runtime is configured to have a memory limit of only' ); ?>
                            <strong><?php echo $current_mem_limit; ?></strong>.
                            <?php echo __( 'We recommend increasing this limit to at least' ); ?>
                            <strong><?php echo $ideal_mem_limit; ?></strong>.
                        </p>
                        <p>
                            <?php echo __( 'For more information on how to adjust your memory limit, please consult' ); ?>
                            <a href="http://php.net/manual/en/ini.core.php#ini.memory-limit">
                                <?php echo __( 'the PHP manual' ); ?>
                            </a>
                            <?php echo __( 'or your hosting provider.' ); ?>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your PHP runtime is configured with a memory limit of '); ?>
                            <strong><?php echo $current_mem_limit; ?></strong>
                            <?php echo __( 'which meets or exceeds our minimum recommendation of' ); ?>
                            <strong><?php echo $ideal_mem_limit; ?></strong>.
                        </p>
                    </td>
                <?php endif; ?>
            </tr>

            <?php // Max execution time configuration check ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Maximum execution time' ); ?>
                </th>
                <?php if ( ! $current_max_execution_time): ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your PHP runtime is configured to have a no maximum execution time.' ); ?>
                        </p>
                    </td>
                <?php elseif ( $current_max_execution_time < $ideal_max_execution_time ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'Your PHP runtime is configured to have a maximum execution time of' ); ?>
                            <strong><?php echo $current_max_execution_time; ?></strong> <?php echo __( 'seconds' ); ?>.
                            <?php echo __( 'We recommend increasing this limit to at least' ); ?>
                            <strong><?php echo $ideal_max_execution_time; ?></strong> <?php echo __( 'seconds' ); ?>.
                        </p>
                        <p>
                            <?php echo __( "When performing the import, we'll try to boost the maximum execution time and timeout limits for you, but some web hosts impose limits that this software cannot override.  For that reason it is best to manually set timeout values to something high if possible." ); ?>
                        <p>
                            <?php echo __( 'For more information on how to adjust your maximum execution time, please consult' ); ?>
                            <a href="http://php.net/manual/en/info.configuration.php#ini.max-execution-time">
                                <?php echo __( 'the PHP manual' ); ?>
                            </a>
                            <?php echo __( 'or your hosting provider.' ); ?>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your PHP runtime is configured with a maximum execution time of '); ?>
                            <strong><?php echo $current_max_execution_time; ?></strong> <?php echo __( 'seconds' ); ?>,
                            <?php echo __( 'which meets or exceeds our minimum recommendation of' ); ?>
                            <strong><?php echo $ideal_max_execution_time; ?></strong> <?php echo __( 'seconds' ); ?>.
                        </p>
                    </td>
                <?php endif; ?>
            </tr>

            <?php // Check to make sure that the XML extension is available on this server ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'XML extension' ); ?>
                </th>
                <?php if ( ! $xml_extension_installed ): ?>
                    <td class="error result-cell">
                        <?php echo __( 'Failure' ); ?>
                    </td>
                    <td class="error">
                        <p><?php echo __( 'The XML extension could no be found in your PHP environment.  This extension is needed to import your data.' ); ?></p>
                        <p>
                            <?php echo __( 'For more information on how to install or enable the XML extension, please consult' ); ?>
                            <a href="http://php.net/manual/en/xml.installation.php">
                                <?php echo __( 'the PHP manual' ); ?>
                            </a>
                            <?php echo __( 'or your hosting provider.' ); ?>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'The XML extension was found in your PHP environment.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>

            <?php // Check to see if we are able to create and write to a directory to handle
                  // the alternate location for uploaded files. ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Alternate Upload Directory' ); ?>
                </th>
                <?php if ( ! $upload_directory_is_writeable ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'We were unable to create an alternate upload directory at ' ); ?>
                            <em><?php echo $upload_directory_path; ?></em>.
                            <?php echo __( 'This directory is used to store an alternate reference to each imported attachment or file, so that we can redirect requests coming from other sites linking to your files.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'To enable this second location to migrate your files, to, please change the permissions on your file system so that this directory can be created and written to. '); ?>
                        </p>
                    </td>
                <?php else: ?>
                  <td class="success result-cell">
                      <?php echo __( 'Pass' ); ?>
                  </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'The directory' ); ?>
                            <em><?php echo $upload_directory_path; ?></em>
                            <?php echo __( 'exists and can be written to.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>


            <?php // Check to see if the current file system supports symlinks ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Symlink support' ); ?>
                </th>
                <?php if ( ! $supports_symlinks ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'Your site is running on a system that does not support' ); ?>
                            <a href="https://en.wikipedia.org/wiki/Symbolic_link"><?php echo __( 'symlinks' ); ?></a>.
                            <?php echo __( 'Usually this is because you are running on a version of Windows earlier than Vista.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'This will not impact the abilit of your files and attachments to be imported, but requires twice as much space to store the files, once in the standard Wordpress location, and once in a predicatable location so that references to the old Typepad location of the file can be redirected to the new location).' ); ?>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your system supports' ); ?>
                            <a href="https://en.wikipedia.org/wiki/Symbolic_link"><?php echo __( 'symlinks' ); ?></a>,
                            <?php echo __( 'allowing us to have each imported attachment reside at two different paths, and reducing the amount of disk space required to store your files at both their previous Typepad paths and the new Wordpress supported paths.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>

            <?php // Check to see if we have mod_rewrite or something similar
                  // installed, so that we can do Typepad attachment redirection
                  // in the plugin, instead of in mod_rewrite (or wherever else) ?>
            <tr>
                <th scope="row">
                    <?php echo __( '"Pretty" URLs' ); ?>
                </th>
                <?php if ( ! $supports_url_rewrite ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'Your server does not support, or have enabled, any of Wordpress\'s methods for generating' ); ?>
                            <a href="https://codex.wordpress.org/Using_Permalinks">"Pretty Permalinks"</a>.
                            <?php echo __( 'As a result, when other websites request attachments and images at their old Typepad URLs, we cannot redirect them to the new URLs where those attachments reside in your Wordpress install.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'Please enable any of Wordpress\'s "Pretty Permalink" methods on your system.  If this is not possible, you can add the below <em>mod_rewrite</em> rule to your site\'s .htaccess file.  If you are not using the Apache webserver, you will need to consult your server\'s documentation for the equivilent rule.' ); ?>
                        <p>
                        <textarea readonly="readonly" rows="4" style="width: 100%">&lt;IfModule mod_rewrite.c&gt;
RewriteEngine On
RewriteRule ^\.a/(.*)$ /wp-content/uploads/tp2wp-migrated/$1 - [L,R=301]
&lt;/IfModule&gt;</textarea>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Success' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your server supports and is using "Pretty Permalinks".  As a result, we can redirect third party sites that are linking to your attachments to the correct new location for those attachments.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>


            <?php // Check to make sure that the permalink structure is configured correctly ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Permalink structure' ); ?>
                </th>
                <?php if ( ! $current_permalink_structure ): ?>
                    <td class="error result-cell">
                        <?php echo __( 'Failure' ); ?>
                    </td>
                    <td class="error">
                        <p>
                            <?php echo __( 'Your site is using the default Wordpress permalink structure.' ); ?>
                            <?php echo __( 'We recommend changing this structure to' ); ?>
                            <strong><?php echo $ideal_permalink_structure; ?></strong>
                            <?php echo __( 'to reduce the chance of possible issues with imported links to your content archives.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'You can change the permalink pattern for your site on the ' ); ?>
                            <a href="/wp-admin/options-permalink.php">
                                <?php echo __( 'Permalink Settings' ); ?>
                            </a>
                            <?php echo __( 'page.' ); ?>
                        </p>
                        <p>
                           <p>
                                <?php echo __( 'Note though that if you changed the pattern for URLs in your Typepad or Moveable type data from their default, you may need to change the recommended value to something more appropriate for your content.' ); ?>
                            </p>
                        </p>
                    </td>
                <?php elseif ( $ideal_permalink_structure !== $current_permalink_structure ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'Permalinks for your posts are currently configured to be' ); ?>
                            <strong><?php echo $current_permalink_structure; ?></strong>,
                            <?php echo __( 'which may cause errors when linking to older imported posts in your archive.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'We recommend changing this structure to' ); ?>
                            <strong><?php echo $ideal_permalink_structure; ?></strong>
                            <?php echo __( 'to reduce the chance of possible issues with imported links to your content archives.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'You can change the permalink pattern for your site on the ' ); ?>
                            <a href="/wp-admin/options-permalink.php">
                                <?php echo __( 'Permalink Settings' ); ?>
                            </a>
                            <?php echo __( 'page.' ); ?>
                        </p>
                        <p>
                            <p>
                                <?php echo __( 'Note though that if you changed the pattern for URLs in your Typepad or Moveable type data from their default, you may need to change the recommended value to something more appropriate for your content.' ); ?>
                            </p>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your permalinks were correctly configured for maximum compatibility.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>


            <?php // Check to see whether we're currently using a default theme ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Using default Wordpress theme' ); ?>
                </th>
                <?php if ( ! $is_default_theme ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p><?php echo __( 'Wordpress is currently configured to use a non-standard theme, or a theme that did not ship with Wordpress.  To reduce the possibility of a custom theme interfering with an import, please switch to a default theme for the import.' ); ?></p>
                        <p><?php echo __( 'Once you have finished importing your data, you can switch back to a custom theme without problem.' ); ?></p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'Your are currently configured to use a default Wordpress theme.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>

            <?php // Check to make sure other plugins are not activated ?>
            <tr>
                <th scope="row">
                    <?php echo __( 'Other Wordpress plugins are disabled' ); ?>
                </th>
                <?php if ( ! empty( $bad_plugins ) ): ?>
                    <td class="warning result-cell">
                        <?php echo __( 'Warning' ); ?>
                    </td>
                    <td class="warning">
                        <p>
                            <?php echo __( 'There are currently' ); ?>
                            <strong><?php echo count( $bad_plugins ); ?></strong>
                            <?php echo __( 'plugins active in your Wordpress install that are unrelated to importing to the TP2WP imporitng process.' ); ?>
                            <?php echo __( 'While most other plugins will not effect your import, some plugins can slow or halt the importing process.' ); ?>
                        </p>
                        <p>
                            <?php echo __( 'For the maximum chance of success, please disable all other plugins during the importing process. Once the import process is over, you can safely re-enable your other plugins.' ); ?>
                        </p>
                    </td>
                <?php else: ?>
                    <td class="success result-cell">
                        <?php echo __( 'Pass' ); ?>
                    </td>
                    <td class="success">
                        <p>
                            <?php echo __( 'There are currently no other plugins active in your Wordpress installation.' ); ?>
                        </p>
                    </td>
                <?php endif; ?>
            </tr>
        </tbody>
    </table>
</div>

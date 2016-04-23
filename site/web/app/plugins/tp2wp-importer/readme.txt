=== TP2WP Importer ===
Contributors: ReadyMadeWeb, Peter Snyder
Donate link: http://tp2wp.com
Tags: importer, wordpress, typepad, movabletype, attachments, import, uploads, transfer
Requires at least: 3.0
Tested up to: 4.1
Stable tag: 1.0.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

The TP2WP importer uses XML files created by the TP2WP conversion service to import Typepad or MoveableType data into WordPress.

== Description ==

The TP2WP importer uses XML files created by the TP2WP conversion service to import Typepad or MoveableType data into WordPress.

The importer uses a three-step process to check your server, import your data, and then import your attachments:

1. Status Check - To ensure a smooth import of your converted Typepad or MoveableType data, the plugin checks your server configuration. The status checkers will check your memory limit, maximum execution time, XML extension, permalink structure, theme, and plugin configuration.
2. Import Content - This step in the process handles the import of your WXR (WordPress eXtended RSS) file, which you can create at [tp2wp.com](http://tp2wp.com). This imports all text-based data like posts titles, post bodies, authors, comments, tags, and categories.
3. Import Attachments - The final step in the process handles importing of attachments. This relies on your Typepad or Moveable type site being up and running. You will specify all domains or subdomains associated with your site before the import begins. 

These three steps combined with the file conversion process at [tp2wp.com](http://tp2wp.com) allow for as much data as possible to be moved from Typepad or MovableType blogs without manually reconstruction of data. Pages, sidebars, and other content outside of posts are not preserved as part of this process.

NOTE: The [ReadyMade WordPress Importer](https://wordpress.org/plugins/readymade-wordpress-importer-061/) is superseded by this plugin.


== Installation ==

The quickest method for installing the importer is:

1. Upload the `tp2wp-importer` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Click on 'TP2WP Importer' menu which should appear near the bottom of the left sidebar.

= Minimum Hosting Requirements =

*PHP memory limit of at least 256MB
*PHP execution time of at least 180 seconds
*PHP XML extension

If your host does not meet these minimum requirements, you should consider moving to dedicated or virtual dedicated hosting. Many discount or shared hosts do not meet these minimum requirements.

== Changelog ==

= 1.0.12 =

  * When multiple TypePad posts have the same post name, we now generate
    a new unique postname for the duplicately named post(s).  This means that
    all posts will be imported those, even those sharing the same post name /
    slug (though some incoming links will be broken).
  * Small optimization to avoid needing to download duplicate linked to files.
  * Small formatting fixes / corrections

= 1.0.11 =

  * Avoid trying to perform redundant symlinks / copies to existing files
    when creating the legacy (ie /.a./<hash>) style links.

= 1.0.10 =

  * Handle rewriting links to popup versions of images within the plugin
    (previously was only handled in the [coversion](https://convert.tp2wp.com/)
    process.
  * Remove some redundant checking on remote mimetypes, for some quicker
    imports.
  * Small, code-style cleanups

= 1.0.9 =

* Handle much larger data sets by doing some array operations in the database instead of in PHP.  Specifically, find out which posts still need to be imported by using a nested query instead of to different queries and an array_diff, which hits memory limits much quicker.

= 1.0.8 =

* Fix non-fatal error in attachment importer when referencing an undefined array (ie remove some code cruft).
* Some further code formatting to match Wordpress coding standards.

= 1.0.7 =

* Further improve duplicate post detection by only using the `post_name` column, which we're sure will exist since its in Typepad data (as BASENAME).  This allows us to avoid an expensive un-indexed query against `post_title`.

= 1.0.6 =

* Improve duplicate post detection method to avoid false positives (previously the importer only checked for posts matching by title and date, which didn't work well with Typepad's exported data, where the drafts and posts have the same date)

= 1.0.5 =

* Remove a non-fatal error by having the TP2WP_Import::bump_request_timeout() signature match the parent, WP_Importer::bump_request_timeout($val) signature.
* Add support for bzip2'ed .wxr uploads.
* Fix fatal error when zip module wasn't loaded / available.

= 1.0.4 =

* Symlink / copy all files into a flat directory structure too, to allow for redirection rules from .a/<hash> (in TypePad) to wp-content/uploads/tp2wp-migration/<hash>.
* Also add in-pluguin URL redirection from Typepad attachment URLs to Wordpress attachment URLs (when the Wordpress equivalent exists in the above described directory)
* Add several checks to the status page (pretty urls, supports symlinks, etc)
* Fix issue with uploaded, zip'ed wxr files are not properly processed.

= 1.0.3 =
* Further corrections to plugin title in WordPress admin.

= 1.0.2 =
* Corrections to plugin title and attribution in WordPress admin.

= 1.0.1 =
* Updates to Status Check portion of the plugin.

= 1.0.0 =
* Initial release of new plugin. The [ReadyMade WordPress Importer](https://wordpress.org/plugins/readymade-wordpress-importer-061/) is superseded by this plugin.

= WordPress Importer =

Step 2 of our import process is a branch of the default WordPress importer. Our version modifies the default in three ways:

1. If there is an attachment in the WXR and the importer is not able to determine the file type from the file name (ie missing extension), the patched version will make a light (body-less) request to the web server where the file is hosted for information we can use about the file. The things we're interested in are file type, size, and filename.
2. If the importer is processing an attachment under the above situation, and it is able to determine the file type, then it will rewrite the local version of the file to have the appropriate file extension.
3. When moving from one host to another, or from WordPress.com to a self-hosted site, you may setup hosting for your domain, let's call it "yourdomain.com" for example, before publicly directing the DNS to the new server. This is the correct thing to do if importing using WXR files. However, some hosts will then process references to "yourdomain.com" as internal references, rather than links to outside resources. This means that the importation process is essentially short circuited, with the public version of "yourdomain.com" being invisible to your new server. The ReadyMade WordPress Importer solves this problem by using TW2WP.com servers to identify the public IP of the source server and then uses that IP, rather than the domain, to import files.

== Frequently Asked Questions ==

More Info: [WordPress Codex: Importing Content](http://codex.wordpress.org/Importing_Content#Before_Importing)

More Info: [tp2wp.com/faq](http://tp2wp.com/faq)
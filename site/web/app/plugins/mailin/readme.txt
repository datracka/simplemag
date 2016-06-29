=== SendinBlue Subscribe Form And WP SMTP ===
Contributors: neeraj_slit
Tags: sendinblue, mailin, email marketing, email campaign, newsletter, wordpress smtp, subscription form, phpmailer, SMTP, wp_mail, massive email, sendmail, ssl, tls, wp-phpmailer, mail smtp, mailchimp, newsletters, email plugin, signup form, email widget, widget, plugin, sidebar, shortcode
Requires at least: 3.0
Tested up to: 4.5
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Easily send emails from your WordPress blog using your preferred SMTP server

== Description ==

<a href="https://www.sendinblue.com/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=addons_page" target="_blank">SendinBlue</a>’s official plugin for WP is a powerful all-in-one email marketing plugin. At a glance:
<ul>
<li><b>Subscribe forms</b> - Create custom subscribe forms and integrate them easily in your posts, pages or sidebars</li>
<li><b>Contact lists</b>  - Manage your contact lists and take advantage of advanced segmentation to improve your campaigns performance</li>
<li><b>Marketing campaigns</b> - Easily create and send beautiful newsletters using drag and drop builder or selecting from our template library</li>
<li><b>Transactional emails</b> - The wp_mail() function use automatically SendinBlue’s SMTP for enhanced deliverability and tracking</li>
<li><b>Statistics</b> - Real-time dashboard giving you a global insight over deliverability and performance: opens, clicks, bounce reports, etc.</li>
</ul> 

= Subcribe forms =
<ul>
<li>Form designer with direct HTML / CSS editor if needed</li>
<li>Integration as widget or shortcode [sibwp_form]</li>
<li>Confirmation email - you choose the template and the sender</li>
<li>Double optin - you choose the template and the sender</li>
<li>URL Redirection</li>
<li>Confirmation / error message customization</li>
</ul> 

= Contact Lists =
<ul>
<li>Folder and lists management</li>
<li>Files import</li>
<li>Custom fields</li>
<li>Advanced segmentation. Example: Contacts below 45 years who clicked on the link 3 of my last campagne</li>
</ul> 

= Marketing campaigns =
<ul>
<li>Responsive design newsletter builder (drag & drop)</li>
<li>Advance newsletter builder</li>
<li>Subject and content personalization. Example: Hello {NAME} </li>
<li>Inbox and multi-clients rendering tests</li>
<li>Campaign programming</li>
</ul> 

= Transactional emails & statistics =
<ul>
<li>Automatic replacement of default SMTP when you use wp_mail function</li>
<li>Create transactional email templates easy to reuse from API</li>
<li>Real time and exhaustive statistics: delivered, opens, clicks, etc.</li>
</ul> 

= Plugin Support =
To get support, please send an email to <a href="mailto:contact@sendinblue.com">contact@sendinblue.com</a>, we will be happy to help you!

The plugin is available in English and French. 

== Installation ==

1.	In your WordPress admin panel, go to Plugins > New Plugin, search for "SendinBlue for WP" and click "Install now". Alternatively, download the plugin and upload the contents of mailin.zip to your plugins directory, which may be  /wp-content/plugins/. 
2.	Activate the plugin SendinBlue through the 'Plugins' menu in WordPress. 
3.	A tab « SendinBlue » must appear in your wordpress side navigation panel, then set your <a href="https://my.sendinblue.com/advanced/apikey/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=addons_page" target="_blank">SendinBlue API key</a> in the plugin homepage.

To get SendinBlue API key, you have to <a href="https://www.sendinblue.com/users/signup/?utm_source=wordpress_plugin&utm_medium=plugin&utm_campaign=addons_page" target="_blank">create an account</a>. It's free and takes less than 2 minutes!

== Screenshots ==
1. First, your are invited to create an account on SendinBlue then enter your API keys
2. The Homepage gives you an overall view over your campaigns and allows you to activate SendinBlue SMTP for all transactional emails
3. The Settings page allows you to configure your sign up process and customize your form
4. The Lists page allows you to see, edit or filter, your lists and your contacts
5. The Campaigns page gives you summary on your last campaigns performance and allow you to create a new campaign using our great Newsletter editor (responsive design)
6. The Statistic page gives you a global view over your performance : delivered, openeded, clicked, etc.
7. From the widget page, you are able to add the SendinBlue widget in one or more sidebars. For each form, you can choose the fields displayed and the list where contacts are saved.

== Frequently Asked Questions ==

= What is SendinBlue? =
SendinBlue is a powerful all-in-one marketing platform. Combining many powerful features, a competitive pricing  and a very good deliverability thanks to our propiertary Cloud-base infrastructure, SendinBlue managed to convince thousand of companies to use the platform for their newsletters, automatic emails or SMS. SendinBlue is available in 5 languages : English, Spanish, French, Italian, Brazilian.

= Why use SendinBlue as an SMTP relay for my website? =
By using SendinBlue’s SMTP, you will avoid the risk of having your legitimate emails ending up in the spam folder and you will have statistics on emails sent : deliverability, opens, clicks, etc. SendinBlue’s proprietary infrastructure optimizes your deliverability and let you focus on emails content.

= Why do I need a SendinBlue accout? =
SendinBlue for WP plugin uses SendinBlue’s API to synchronize contacts, send emails or get statistics. Creating an account on SendinBlue is free and takes less than 2 minutes. Once logged in your contact, you can get the API key from this page.
 
= Do I have to pay to use the plugin and send emails? =
No, the plugin is totally free and Sendinblue proposes a free plan with 9,000 emails per month. If you need to send more than 9,000 emails / month, we invite you to see our pricing. For example, the Micro plan is $7.44 / month and allows you to send up to 40,000 emails per month. All SendinBlue plans are without any commitment.

= How do I get my get synchronize my lists? =
You have nothing to do sSynchronization is automatic! It doesn't matter whether your lists were uploaded on your WordPress interface or on your SendiBlue account: they will always remain up-to-date on both sides.

= How can I get support? =
If you need some assistance, you can post an issue in the tab « Support » or send us an email on contact@sendinblue.com.

= How do I create a signup form? =
In order to create a signup form, you have to :
1. Go to Wp admin > SendinBlue > Settings in order to define your form’s fields and settings
2. Integrate the form in a sidebar using a widget from WP panel > Appearance > Widgets. SendinBlue widget form should appear in your widgets list, you just to have to drag and drop the widget into the sidebar of your choice. 


== Changelog ==
= 2.5.5 =
* Fix send email issue

= 2.5.4 =
* Fix warning issue by get sender detail

= 2.5.3 =
* Fix some warning issue to send email

= 2.5.2 =
* Fix send email issue on php 7.0

= 2.5.1 =
* Fix sender list issue
* Fix attachment issue in transactional email
* Update form ajax process

= 2.5.0 =
* Improvement the sender list

= 2.4.15 =
* Fix transactional email issue

= 2.4.14 =
* Fix SMTP issue using wp_mail
* Fix some warning issue

= 2.4.13 =
* Fix some warning issue

= 2.4.12 =
* Fix issue for double optin redirection

= 2.4.11 =
* Fix some errors related to SSL certificate

= 2.4.10 =
* Fix page reload problem on submitting form data

= 2.4.9 =
* Improve transaction template with tags
* Improve subscriber's ip attribute
* Fix some warning issue

= 2.4.8 =
* Update email credits.
* Fix language issue in iframe

= 2.4.7 =
* Fix exception functionality of curl.

= 2.4.6 =
* Fix some issue of curl request.
* Improve subscriber's attributes for double optin.

= 2.4.5 =
* Fix some warning issue and translation

= 2.4.4 =
* Update sendinblue API library into V2.0

= 2.4.3 =
* Fix some warning issue

= 2.4.2 =
* Fix sender issue

= 2.4.1 =
* Fix ajax warning bug

= 2.4.0 =
* Security update to prevent XSS attack.
* Improve transaction template with personalize data.
* Improve widget.

= 2.3.13 =
* No changes in "Settings" after update.

= 2.3.12 =
* Improve validation process.

= 2.3.11 =
* Update validation process.
* Improve error message.

= 2.3.10 =
* Add the functionality to integrate the category attributes of sendinblue.
* Improve loading of setting page.

= 2.3.9 =
* Change iframe url.

= 2.3.7 =
* Update the process for help message.

= 2.3.6 =
* Update the process for blacklisted contact.

= 2.3.5 =
* Improve the function that send template for confirm & double optin.
* Update the process for blacklisted contact.
* Fix the issue of wrong subject in selected template.

= 2.3.4 =
* Fix the issue that user can't send selected template for confirm & double optin.
* Fix the error if user don't have any sender on his setting.

= 2.3.3 =
* Improvement help message.

= 2.3.2 =
* Check with wordpress version 4.1.
* Add function to select mail template for double optin.
* Improvement help message.
* Fix padding issue of subscribe form.
* Update the state of smtp activation automatically.

= 2.3.1 =
* Update sender setting.

= 2.3.0 =
* Updated sendinblue api into v2.0.
Please use the Access Key of API 2.0 in setting of plugin after update plugin.

= 2.2.5 =
* Add exception functionality.

= 2.2.4 =
* Fix some warning issues.

= 2.2.3 =
* Fix sender's details when send email by using wp_mail().

= 2.2.2 =
* Fixed some issue of curl request.

= 2.2.1 =
* Update the french encoding.
* Fixed multi-language issue

= 2.2.0 =
* Update the feautre of smtp activation

= 2.1.2 =
* Update button UI CSS of subscription form

= 2.1.1 =
* Fix login issue
* Test on Wordpress 4.0

= 2.1.0 =
* Update the default form UI
* Update french translation
* Add functionality to remove "white space" when input api info for login.

= 2.0.4 =
* Add security functionality

= 2.0.3 =
* Fix the encode error of French language
* Add the translation of some text
* Fix the Button size at French 

= 2.0.2 =
* Fix the error of account detail

= 2.0.1 =
* Fix compatible error

= 2.0 =
* update sendinblue api
* Add functionality (List,Contact,Stat,Form Management)
* Update UI user-friendly

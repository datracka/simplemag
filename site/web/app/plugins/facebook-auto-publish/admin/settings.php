<?php

global $current_user;
$auth_varble=0;
get_currentuserinfo();
$imgpath= plugins_url()."/facebook-auto-publish/admin/images/";
$heimg=$imgpath."support.png";
$ms1="";
$ms2="";
$ms3="";
$ms4="";
$redirecturl=admin_url('admin.php?page=facebook-auto-publish-settings&auth=1');


require( dirname( __FILE__ ) . '/authorization.php' );


if($_GET['fbap_notice'] == 'hide')
{
	update_option('xyz_fbap_dnt_shw_notice', "hide");
	?>
<style type='text/css'>
#fb_notice_td
{
display:none;
}
</style>
<div class="system_notice_area_style1" id="system_notice_area">
Thanks again for using the plugin. We will never show the message again.
 &nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php
}


$erf=0;
if(isset($_POST['fb']))
{

	$ss=array();
	if(isset($_POST['fbap_pages_list']))
	$ss=$_POST['fbap_pages_list'];
	
	$fbap_pages_list_ids="";


	if($ss!="" && count($ss)>0)
	{
		for($i=0;$i<count($ss);$i++)
		{
			$fbap_pages_list_ids.=$ss[$i].",";
		}

	}
	else
		$fbap_pages_list_ids.=-1;

	$fbap_pages_list_ids=rtrim($fbap_pages_list_ids,',');


	update_option('xyz_fbap_pages_ids',$fbap_pages_list_ids);



	$applidold=get_option('xyz_fbap_application_id');
	$applsecretold=get_option('xyz_fbap_application_secret');
	$fbidold=get_option('xyz_fbap_fb_id');
	
	$posting_method=$_POST['xyz_fbap_po_method'];
	$posting_permission=$_POST['xyz_fbap_post_permission'];
	$appid=$_POST['xyz_fbap_application_id'];
	$appsecret=$_POST['xyz_fbap_application_secret'];
	$messagetopost=$_POST['xyz_fbap_message'];
	$fbid=$_POST['xyz_fbap_fb_id'];
	if($appid=="" && $posting_permission==1)
	{
		$ms1="Please fill facebook application id.";
		$erf=1;
	}
	elseif($appsecret=="" && $posting_permission==1)
	{
		$ms2="Please fill facebook application secret.";
		$erf=1;
	}
	elseif($fbid=="" && $posting_permission==1)
	{
		$ms3="Please fill facebook user id.";
		$erf=1;
	}
	elseif($messagetopost=="" && $posting_permission==1)
	{
		$ms4="Please fill message format for posting.";
		$erf=1;
	}
	else
	{
		$erf=0;
		if($appid!=$applidold || $appsecret!=$applsecretold || $fbidold!=$fbid)
		{
			update_option('xyz_fbap_af',1);
			update_option('xyz_fbap_fb_token','');
		}
		if($messagetopost=="")
		{
			$messagetopost="New post added at {BLOG_TITLE} - {POST_TITLE}";
		}

		update_option('xyz_fbap_application_id',$appid);
		update_option('xyz_fbap_post_permission',$posting_permission);
		update_option('xyz_fbap_application_secret',$appsecret);
		update_option('xyz_fbap_fb_id',$fbid);
		update_option('xyz_fbap_po_method',$posting_method);
		update_option('xyz_fbap_message',$messagetopost);

		$url = 'https://graph.facebook.com/'.XYZ_FBAP_FB_API_VERSION."/me";
		$contentget=wp_remote_get($url);$page_id="";
		if(is_array($contentget))
		{
			$result1=$contentget['body'];
			$pagearray = json_decode($result1);
			if(isset($pagearray->id))
			$page_id=$pagearray->id;
		}
		
			

		update_option('xyz_fbap_fb_numericid',$page_id);

	}
}



if(isset($_POST['fb']) && $erf==0)
{
	?>

<div class="system_notice_area_style1" id="system_notice_area">
	Settings updated successfully. &nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php }
if(isset($_GET['msg']) && $_GET['msg']==2)
{
?>
<div class="system_notice_area_style0" id="system_notice_area">
	The state does not match. You may be a victim of CSRF. &nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
</div>
	<?php 
}
if(isset($_GET['msg']) && $_GET['msg']==3)
{
	?>
<div class="system_notice_area_style0" id="system_notice_area">
Unable to authorize the facebook application. Please check your curl/fopen and firewall settings. &nbsp;&nbsp;&nbsp;<span
		id="system_notice_area_dismiss">Dismiss</span>
</div>	
<?php 
}

if(isset($_POST['fb']) && $erf==1)
{
	?>
<div class="system_notice_area_style0" id="system_notice_area">
	<?php 
	if(isset($_POST['fb']))
	{
		echo $ms1;echo $ms2;echo $ms3;echo $ms4;
	}
	?>
	&nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php } ?>
<script type="text/javascript">
function detdisplay(id)
{
	document.getElementById(id).style.display='';
}
function dethide(id)
{
	document.getElementById(id).style.display='none';
}

</script>

<div style="width: 100%">

	<h2>
		 <img src="<?php echo plugins_url()?>/facebook-auto-publish/admin/images/facebook-logo.png" height="16px"> Facebook Settings
	</h2>
	<?php
	$af=get_option('xyz_fbap_af');
	$appid=esc_html(get_option('xyz_fbap_application_id'));
	$appsecret=esc_html(get_option('xyz_fbap_application_secret'));
	$fbid=esc_html(get_option('xyz_fbap_fb_id'));
	$posting_method=get_option('xyz_fbap_po_method');
	$posting_message=esc_textarea(get_option('xyz_fbap_message'));
	if($af==1 && $appid!="" && $appsecret!="" && $fbid!="")
	{
		?>
	<span style="color: red;">Application needs authorisation</span> <br>
	<form method="post">

		<input type="submit" class="submit_fbap_new" name="fb_auth"
			value="Authorize" /><br><br>

	</form>
	<?php }
	else if($af==0 && $appid!="" && $appsecret!="" && $fbid!="")
	{
		?>
	<form method="post">
	
	<input type="submit" class="submit_fbap_new" name="fb_auth"
	value="Reauthorize" title="Reauthorize the account" /><br><br>
	
	</form>
	<?php }


	if(isset($_GET['auth']) && $_GET['auth']==1 && get_option("xyz_fbap_fb_token")!="")
	{
		?>

	<span style="color: green;">Application is authorized, go posting.
	</span><br>

	<?php 	
	}
	?>

	
	<table class="widefat" style="width: 99%;background-color: #FFFBCC">
	<tr>
	<td id="bottomBorderNone">
	
	<div>


		<b>Note :</b> You have to create a Facebook application before filling the following details.
		<b><a href="https://developers.facebook.com/apps" target="_blank">Click here</a></b> to create new Facebook application. 
		<br>In the application page in facebook, navigate to <b>Apps > Settings > Edit settings > Website > Site URL</b>. Set the site url as : 
		<span style="color: red;"><?php echo  (is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST']; ?></span>
<br>For detailed step by step instructions <b><a href="http://docs.xyzscripts.com/wordpress-plugins/facebook-auto-publish/creating-facebook-application/" target="_blank">Click here</a></b>.
	</div>

	</td>
	</tr>
	</table>
	
	<form method="post">
		<input type="hidden" value="config">





			<div style="font-weight: bold;padding: 3px;">All fields given below are mandatory</div> 
			<table class="widefat xyz_fbap_widefat_table" style="width: 99%">
				<tr valign="top">
					<td width="50%">Application id
					</td>
					<td><input id="xyz_fbap_application_id"
						name="xyz_fbap_application_id" type="text"
						value="<?php if($ms1=="") {echo esc_html(get_option('xyz_fbap_application_id'));}?>" />
						<a href="http://docs.xyzscripts.com/wordpress-plugins/social-media-auto-publish/creating-facebook-application" target="_blank">How can I create a Facebook Application?</a>
					</td>
				</tr>

				<tr valign="top">
					<td>Application secret<?php   $apsecret=esc_html(get_option('xyz_fbap_application_secret'));?>
						
					</td>
					<td><input id="xyz_fbap_application_secret"
						name="xyz_fbap_application_secret" type="text"
						value="<?php if($ms2=="") {echo $apsecret; }?>" />
					</td>
				</tr>
				<tr valign="top">
					<td>Facebook user id 
					</td>
					<td><input id="xyz_fbap_fb_id" name="xyz_fbap_fb_id" type="text"
						value="<?php if($ms3=="") {echo esc_html(get_option('xyz_fbap_fb_id'));}?>" />
						<a href="http://kb.xyzscripts.com/how-can-i-find-my-facebook-user-id" target="_blank">How can I find my Facebook user id?</a>
					</td>
				</tr>
				<tr valign="top">
					<td>Message format for posting <img src="<?php echo $heimg?>"
						onmouseover="detdisplay('xyz_fb')" onmouseout="dethide('xyz_fb')">
						<div id="xyz_fb" class="informationdiv" style="display: none;">
							{POST_TITLE} - Insert the title of your post.<br />{PERMALINK} -
							Insert the URL where your post is displayed.<br />{POST_EXCERPT}
							- Insert the excerpt of your post.<br />{POST_CONTENT} - Insert
							the description of your post.<br />{BLOG_TITLE} - Insert the name
							of your blog.<br />{USER_NICENAME} - Insert the nicename
							of the author.
						</div></td>
	<td>
	<select name="xyz_fbap_info" id="xyz_fbap_info" onchange="xyz_fbap_info_insert(this)">
		<option value ="0" selected="selected">--Select--</option>
		<option value ="1">{POST_TITLE}  </option>
		<option value ="2">{PERMALINK} </option>
		<option value ="3">{POST_EXCERPT}  </option>
		<option value ="4">{POST_CONTENT}   </option>
		<option value ="5">{BLOG_TITLE}   </option>
		<option value ="6">{USER_NICENAME}   </option>
		</select> </td></tr><tr><td>&nbsp;</td><td>
		<textarea id="xyz_fbap_message"  name="xyz_fbap_message" style="height:80px !important;" ><?php if($ms4==""){ 
								echo esc_textarea(get_option('xyz_fbap_message'));}?></textarea>
	</td></tr>
				
				
				
				<tr valign="top">
					<td>Posting method
					</td>
					<td>
					<select id="xyz_fbap_po_method" name="xyz_fbap_po_method">
							<option value="3"
				<?php  if(get_option('xyz_fbap_po_method')==3) echo 'selected';?>>Simple text message</option>
				
				<optgroup label="Text message with image">
					<option value="4"
					<?php  if(get_option('xyz_fbap_po_method')==4) echo 'selected';?>>Upload image to app album</option>
					<option value="5"
					<?php  if(get_option('xyz_fbap_po_method')==5) echo 'selected';?>>Upload image to timeline album</option>
				</optgroup>
				
				<optgroup label="Text message with attached link">
					<option value="1"
					<?php  if(get_option('xyz_fbap_po_method')==1) echo 'selected';?>>Attach
						your blog post</option>
					<option value="2"
					<?php  if(get_option('xyz_fbap_po_method')==2) echo 'selected';?>>
						Share a link to your blog post</option>
					</optgroup>
					</select>
					</td>
				</tr>
				<tr valign="top">
					<td>Enable auto publish post to my facebook account
					</td>
					<td><select id="xyz_fbap_post_permission"
						name="xyz_fbap_post_permission"><option value="0"
						<?php  if(get_option('xyz_fbap_post_permission')==0) echo 'selected';?>>
								No</option>
							<option value="1"
							<?php  if(get_option('xyz_fbap_post_permission')==1) echo 'selected';?>>Yes</option>
					</select>
					</td>
				</tr>
				<?php 

				$xyz_acces_token=get_option('xyz_fbap_fb_token');
				if($xyz_acces_token!=""){

					$offset=0;$limit=100;$data=array();
					$fbid=get_option('xyz_fbap_fb_id');
					do
					{
						$result1="";$pagearray1="";
						$pp=wp_remote_get("https://graph.facebook.com/".XYZ_FBAP_FB_API_VERSION."/me/accounts?access_token=$xyz_acces_token&limit=$limit&offset=$offset");
						if(is_array($pp))
						{
							$result1=$pp['body'];
							$pagearray1 = json_decode($result1);
							if(is_array($pagearray1->data))                       
							$data = array_merge($data, $pagearray1->data);
						}
						else
							break;
						$offset += $limit;
// 						if(!is_array($pagearray1->paging))
// 							break;
// 					}while(array_key_exists("next", $pagearray1->paging));
					}while(isset($pagearray1->paging->next));



					$count=count($data);
					
						$fbap_pages_ids1=get_option('xyz_fbap_pages_ids');
						$fbap_pages_ids0=array();
						if($fbap_pages_ids1!="")
							$fbap_pages_ids0=explode(",",$fbap_pages_ids1);
						
						$fbap_pages_ids=array();
						for($i=0;$i<count($fbap_pages_ids0);$i++)
						{
							if($fbap_pages_ids0[$i]!="-1")
							$fbap_pages_ids[$i]=trim(substr($fbap_pages_ids0[$i],0,strpos($fbap_pages_ids0[$i],"-")));
						    else
							$fbap_pages_ids[$i]=$fbap_pages_ids0[$i];
						}
						
					//$data[$i]->id."-".$data[$i]->access_token
						?>

				<tr valign="top">
					<td>Select facebook pages for auto	publish
					</td>
					<td><select name="fbap_pages_list[]" multiple="multiple" style="height:auto !important;">
							<option value="-1"
							<?php if(in_array(-1, $fbap_pages_ids)) echo "selected" ?>>Profile	Page</option>
							<?php 
							for($i=0;$i<$count;$i++)
							{
								?>
							<option
								value="<?php  echo $data[$i]->id."-".$data[$i]->access_token;?>"
								<?php

								
								if(in_array($data[$i]->id, $fbap_pages_ids)) echo "selected" ?>>

								<?php echo $data[$i]->name; ?>
							</option>
							<?php }?>
					</select>
					</td>
				</tr>


				<?php 
				}?>
				<tr><td   id="bottomBorderNone"></td>
					<td  id="bottomBorderNone"><div style="height: 50px;">
							<input type="submit" class="submit_fbap_new"
								style=" margin-top: 10px; "
								name="fb" value="Save" /></div>
					</td>
				</tr>
			</table>

	</form>



	<?php 

	if(isset($_POST['bsettngs']))
	{

		$xyz_fbap_include_pages=$_POST['xyz_fbap_include_pages'];
		$xyz_fbap_include_posts=$_POST['xyz_fbap_include_posts'];
		
		if($_POST['xyz_fbap_cat_all']=="All")
			$fbap_category_ids=$_POST['xyz_fbap_cat_all'];//redio btn name
		else
			$fbap_category_ids=$_POST['xyz_fbap_sel_cat'];//dropdown

		$xyz_customtypes="";
		
        if(isset($_POST['post_types']))
		$xyz_customtypes=$_POST['post_types'];

        $xyz_fbap_peer_verification=$_POST['xyz_fbap_peer_verification'];
        $xyz_fbap_premium_version_ads=$_POST['xyz_fbap_premium_version_ads'];
        $xyz_fbap_default_selection_edit=$_POST['xyz_fbap_default_selection_edit'];
        
        $xyz_fbap_future_to_publish=$_POST['xyz_fbap_future_to_publish'];
		$fbap_customtype_ids="";

		$xyz_fbap_applyfilters="";
		if(isset($_POST['xyz_fbap_applyfilters']))
			$xyz_fbap_applyfilters=$_POST['xyz_fbap_applyfilters'];
		
		
		if($xyz_customtypes!="")
		{
			for($i=0;$i<count($xyz_customtypes);$i++)
			{
				$fbap_customtype_ids.=$xyz_customtypes[$i].",";
			}
		}
		$fbap_customtype_ids=rtrim($fbap_customtype_ids,',');

		$xyz_fbap_applyfilters_val="";
		if($xyz_fbap_applyfilters!="")
		{
			for($i=0;$i<count($xyz_fbap_applyfilters);$i++)
			{
				$xyz_fbap_applyfilters_val.=$xyz_fbap_applyfilters[$i].",";
			}
		}
		$xyz_fbap_applyfilters_val=rtrim($xyz_fbap_applyfilters_val,',');
		
		update_option('xyz_fbap_apply_filters',$xyz_fbap_applyfilters_val);
		update_option('xyz_fbap_include_pages',$xyz_fbap_include_pages);
		update_option('xyz_fbap_include_posts',$xyz_fbap_include_posts);
		if($xyz_fbap_include_posts==0)
			update_option('xyz_fbap_include_categories',"All");
		else
			update_option('xyz_fbap_include_categories',$fbap_category_ids);
		update_option('xyz_fbap_include_customposttypes',$fbap_customtype_ids);
		update_option('xyz_fbap_peer_verification',$xyz_fbap_peer_verification);
		update_option('xyz_fbap_premium_version_ads',$xyz_fbap_premium_version_ads);
		update_option('xyz_fbap_default_selection_edit',$xyz_fbap_default_selection_edit);
		update_option('xyz_fbap_future_to_publish',$xyz_fbap_future_to_publish);
	}
	$xyz_fbap_future_to_publish=get_option('xyz_fbap_future_to_publish');
	$xyz_credit_link=get_option('xyz_credit_link');
	$xyz_fbap_include_pages=get_option('xyz_fbap_include_pages');
	$xyz_fbap_include_posts=get_option('xyz_fbap_include_posts');
	$xyz_fbap_include_categories=get_option('xyz_fbap_include_categories');
	$xyz_fbap_include_customposttypes=get_option('xyz_fbap_include_customposttypes');
	$xyz_fbap_apply_filters=get_option('xyz_fbap_apply_filters');
	$xyz_fbap_peer_verification=esc_html(get_option('xyz_fbap_peer_verification'));
	$xyz_fbap_premium_version_ads=esc_html(get_option('xyz_fbap_premium_version_ads'));
	$xyz_fbap_default_selection_edit=esc_html(get_option('xyz_fbap_default_selection_edit'));

	?>
		<h2>Basic Settings</h2>


		<form method="post">

			<table class="widefat xyz_fbap_widefat_table" style="width: 99%">

				<tr valign="top">

					<td  colspan="1" width="50%">Publish wordpress `pages` to facebook
					</td>
					<td><select name="xyz_fbap_include_pages">

							<option value="1"
							<?php if($xyz_fbap_include_pages=='1') echo 'selected'; ?>>Yes</option>

							<option value="0"
							<?php if($xyz_fbap_include_pages!='1') echo 'selected'; ?>>No</option>
					</select>
					</td>
				</tr>

				<tr valign="top">

					<td  colspan="1">Publish wordpress `posts` to facebook
					</td>
					<td><select name="xyz_fbap_include_posts" onchange="xyz_fbap_show_postCategory(this.value);">

							<option value="1"
							<?php if($xyz_fbap_include_posts=='1') echo 'selected'; ?>>Yes</option>

							<option value="0"
							<?php if($xyz_fbap_include_posts!='1') echo 'selected'; ?>>No</option>
					</select>
					</td>
				</tr>
				
				<tr valign="top" id="selPostCat">

					<td  colspan="1">Select post categories for auto publish
					</td>
					<td><input type="hidden"
						value="<?php echo $xyz_fbap_include_categories;?>"
						name="xyz_fbap_sel_cat" id="xyz_fbap_sel_cat"> <input type="radio"
						name="xyz_fbap_cat_all" id="xyz_fbap_cat_all" value="All"
						onchange="rd_cat_chn(1,-1)"
						<?php if($xyz_fbap_include_categories=="All") echo "checked"?>>All<font
						style="padding-left: 10px;"></font><input type="radio"
						name="xyz_fbap_cat_all" id="xyz_fbap_cat_all" value=""
						onchange="rd_cat_chn(1,1)"
						<?php if($xyz_fbap_include_categories!="All") echo "checked"?>>Specific

						<span id="cat_dropdown_span"><br /> <br /> <?php 


						$args = array(
								'show_option_all'    => '',
								'show_option_none'   => '',
								'orderby'            => 'name',
								'order'              => 'ASC',
								'show_last_update'   => 0,
								'show_count'         => 0,
								'hide_empty'         => 0,
								'child_of'           => 0,
								'exclude'            => '',
								'echo'               => 0,
								'selected'           => '1 3',
								'hierarchical'       => 1,
								'id'                 => 'xyz_fbap_catlist',
								'class'              => 'postform',
								'depth'              => 0,
								'tab_index'          => 0,
								'taxonomy'           => 'category',
								'hide_if_empty'      => false );

						if(count(get_categories($args))>0)
						{
							$args['name']='xyz_fbap_catlist';
							echo str_replace( "<select", "<select multiple onClick=setcat(this) style='width:200px;height:auto !important;border:1px solid #cccccc;'", wp_dropdown_categories($args));
						}
						else
							echo "NIL";

						?><br /> <br /> </span>
					</td>
				</tr>


				<tr valign="top">

					<td  colspan="1">Select wordpress custom post types for auto publish</td>
					<td><?php 

					$args=array(
							'public'   => true,
							'_builtin' => false
					);
					$output = 'names'; // names or objects, note names is the default
					$operator = 'and'; // 'and' or 'or'
					$post_types=get_post_types($args,$output,$operator);

					$ar1=explode(",",$xyz_fbap_include_customposttypes);
					$cnt=count($post_types);
					foreach ($post_types  as $post_type ) {

						echo '<input type="checkbox" name="post_types[]" value="'.$post_type.'" ';
						if(in_array($post_type, $ar1))
						{
							echo 'checked="checked"/>';
						}
						else
							echo '/>';

						echo $post_type.'<br/>';

					}
					if($cnt==0)
						echo 'NA';
					?>
					</td>
				</tr>

				<tr valign="top">

					<td scope="row" colspan="1" width="50%">Default selection of auto publish while editing posts/pages	
					</td><td><select name="xyz_fbap_default_selection_edit" >
					
					<option value ="1" <?php if($xyz_fbap_default_selection_edit=='1') echo 'selected'; ?> >Yes </option>
					
					<option value ="0" <?php if($xyz_fbap_default_selection_edit=='0') echo 'selected'; ?> >No </option>
					</select> 
					</td>
				</tr>
					
				<tr valign="top">
				
				<td scope="row" colspan="1" width="50%">SSL peer verification	</td><td><select name="xyz_fbap_peer_verification" >
				
				<option value ="1" <?php if($xyz_fbap_peer_verification=='1') echo 'selected'; ?> >Enable </option>
				
				<option value ="0" <?php if($xyz_fbap_peer_verification=='0') echo 'selected'; ?> >Disable </option>
				</select> 
				</td></tr>
					
				<tr valign="top">
					<td scope="row" colspan="1">Apply filters during publishing	</td>
					<td>
					<?php 
					$ar2=explode(",",$xyz_fbap_apply_filters);
					for ($i=0;$i<3;$i++ ) {
						$filVal=$i+1;
						
						if($filVal==1)
							$filName='the_content';
						else if($filVal==2)
							$filName='the_excerpt';
						else if($filVal==3)
							$filName='the_title';
						else $filName='';
						
						echo '<input type="checkbox" name="xyz_fbap_applyfilters[]"  value="'.$filVal.'" ';
						if(in_array($filVal, $ar2))
						{
							echo 'checked="checked"/>';
						}
						else
							echo '/>';
					
						echo '<label>'.$filName.'</label><br/>';
					
					}
					
					?>
					</td>
				</tr>	
					
				<tr valign="top">

					<td scope="row" colspan="1">Enable "future_to_publish" hook	</td>
					<td><select name="xyz_fbap_future_to_publish" id="xyz_fbap_future_to_publish" >
					
					<option value ="1" <?php if($xyz_fbap_future_to_publish=='1') echo 'selected'; ?> >Yes </option>
					
					<option value ="2" <?php if($xyz_fbap_future_to_publish=='2') echo 'selected'; ?> >No </option>
					</select>
					</td>
				</tr>
					
				<tr valign="top">

					<td  colspan="1">Enable credit link to author
					</td>
					<td><select name="xyz_credit_link" id="xyz_fbap_credit_link">

							<option value="fbap"
							<?php if($xyz_credit_link=='fbap') echo 'selected'; ?>>Yes</option>

							<option
								value="<?php echo $xyz_credit_link!='fbap'?$xyz_credit_link:0;?>"
								<?php if($xyz_credit_link!='fbap') echo 'selected'; ?>>No</option>
					</select>
					</td>
				</tr>
				
				<tr valign="top">

					<td  colspan="1">Enable premium version ads
					</td>
					<td><select name="xyz_fbap_premium_version_ads" id="xyz_fbap_premium_version_ads">

							<option value="1"
							<?php if($xyz_fbap_premium_version_ads=='1') echo 'selected'; ?>>Yes</option>

							<option
								value="0"
								<?php if($xyz_fbap_premium_version_ads=='0') echo 'selected'; ?>>No</option>
					</select>
					</td>
				</tr>
				


				<tr>

					<td id="bottomBorderNone">
							

					</td>

					
<td id="bottomBorderNone"><div style="height: 50px;">
<input type="submit" class="submit_fbap_new" style="margin-top: 10px;" value=" Update Settings" name="bsettngs" /></div></td>
				</tr>
				
			</table>
		</form>
		
		
</div>		

	<script type="text/javascript">
	//drpdisplay();
var catval='<?php echo $xyz_fbap_include_categories; ?>';
var custtypeval='<?php echo $xyz_fbap_include_customposttypes; ?>';
var get_opt_cats='<?php echo get_option('xyz_fbap_include_posts');?>';
jQuery(document).ready(function() {
	  if(catval=="All")
		  jQuery("#cat_dropdown_span").hide();
	  else
		  jQuery("#cat_dropdown_span").show();

	  if(get_opt_cats==0)
		  jQuery('#selPostCat').hide();
	  else
		  jQuery('#selPostCat').show();
			  
	}); 
	
function setcat(obj)
{
var sel_str="";
for(k=0;k<obj.options.length;k++)
{
if(obj.options[k].selected)
sel_str+=obj.options[k].value+",";
}


var l = sel_str.length; 
var lastChar = sel_str.substring(l-1, l); 
if (lastChar == ",") { 
	sel_str = sel_str.substring(0, l-1);
}

document.getElementById('xyz_fbap_sel_cat').value=sel_str;

}

var d1='<?php echo $xyz_fbap_include_categories;?>';
splitText = d1.split(",");
jQuery.each(splitText, function(k,v) {
jQuery("#xyz_fbap_catlist").children("option[value="+v+"]").attr("selected","selected");
});

function rd_cat_chn(val,act)
{//xyz_fbap_cat_all xyz_fbap_cust_all 
	if(val==1)
	{
		if(act==-1)
		  jQuery("#cat_dropdown_span").hide();
		else
		  jQuery("#cat_dropdown_span").show();
	}
	
}

function xyz_fbap_info_insert(inf){
	
    var e = document.getElementById("xyz_fbap_info");
    var ins_opt = e.options[e.selectedIndex].text;
    if(ins_opt=="0")
    	ins_opt="";
    var str=jQuery("textarea#xyz_fbap_message").val()+ins_opt;
    jQuery("textarea#xyz_fbap_message").val(str);
    jQuery('#xyz_fbap_info :eq(0)').prop('selected', true);
    jQuery("textarea#xyz_fbap_message").focus();

}
function xyz_fbap_show_postCategory(val)
{
	if(val==0)
		jQuery('#selPostCat').hide();
	else
		jQuery('#selPostCat').show();
}
</script>
	<?php 
?>
<!-- looks for users: -->

select
  user_nicename,
  count(*) as counter
from
  wp_posts
  INNER JOIN wp_users ON wp_posts.post_author = wp_users.ID
where
    post_type like 'post'
    and post_status = 'publish'
group by user_nicename
order by counter DESC;
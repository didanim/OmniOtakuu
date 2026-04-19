<div id='profile-modal' class='sm-modal'>
  <div class='sm-modal-content'>
    <span class='close-modal'>&times;</span>
    <div class='sm-modal-body'>
      <div class='modal-left'>
        <img id='modal-avatar' src='' alt='Profile Pic'/>
        <h4 id='modal-name'></h4>
      </div>
      <div class='modal-right'>
        <p><strong>This Month:</strong> <span id='month-count'>0</span> comments</p>
        <p><strong>Total:</strong> <span id='total-count'>0</span> comments</p>
        <p><strong>Profile Views:</strong> <span id='view-count'>0</span></p>
        <p><strong>Blog:</strong> <a id='modal-blog' href='#'>None</a></p>
        <p><strong>Blogger:</strong> <a id='modal-link' href=''>View Profile</a></p>
      </div>
    </div>
  </div>
</div>

<script>// <![CDATA[
document.addEventListener('click', function(e) {
  const citeElement = e.target.closest('cite.user');
  
  if (citeElement) {
    e.preventDefault();
    
    const profileUrl = citeElement.getAttribute('data');
    const authorName = citeElement.innerText;
    const authorImg = citeElement.closest('.avatar-box')?.querySelector('img')?.src || '';

    const idMatch = profileUrl.match(/profile\/(\d+)/);
    const profileId = idMatch ? idMatch[1] : null;

    if (profileId) {
      console.log("Detected Profile ID:", profileId);
      showProfileModal(authorName, profileUrl, authorImg, profileId);
    }
  }
});

async function showProfileModal(name, url, img, id) {
  const modal = document.getElementById('profile-modal');
  modal.style.display = 'block';
  
  document.getElementById('modal-name').innerText = name;
  document.getElementById('modal-avatar').src = img;
  
  const res = await fetch(`/feeds/comments/default?alt=json&max-results=500`);
  const data = await res.json();
  const comments = data.feed.entry || [];

  let totalCount = 0;
  let monthCount = 0;
  const now = new Date();

  let userBlog = "None";
comments.forEach(comment => {
  const author = comment.author[0];
  if (author.uri?.$t.includes(id)) {
    if (author.gd$image && author.uri.$t) {
    }
  }
});

  comments.forEach(comment => {
    const commentAuthorUri = comment.author[0].uri?.$t || "";
    if (commentAuthorUri.includes(id)) {
      totalCount++;
      const pubDate = new Date(comment.published.$t);
      if (pubDate.getMonth() === now.getMonth() && pubDate.getFullYear() === now.getFullYear()) {
        monthCount++;
      }
    }
  });

  document.getElementById('total-count').innerText = totalCount;
  document.getElementById('month-count').innerText = monthCount;
}
// ]]></script>

<style>
.sm-modal{display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6);}
.sm-modal-content{background: #fff; margin: 10% auto; padding: 20px; width: 450px; border-radius: 12px; position: relative;}
.sm-modal-body{display: flex; gap: 20px;}
.modal-left{flex: 0 0 120px; text-align: center; border-right: 1px solid #eee; padding-right: 15px;}
#modal-avatar{width: 80px; height: 80px; border-radius: 50%; object-fit: cover;}
.modal-right{flex: 1;}
.modal-right p{margin: 8px 0; font-size: 14px;}
.close-modal{position: absolute; right: 15px; top: 10px; cursor: pointer; font-size: 24px;}
</style>

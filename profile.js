// <![CDATA[
document.addEventListener('click', function(e) {
  const citeElement = e.target.closest('cite.user');
  
  if (citeElement) {
    e.preventDefault();
    
    const profileUrl = citeElement.getAttribute('data');
    const authorName = citeElement.innerText;
    const authorImg = citeElement.closest('.comment-inner')?.querySelector('img')?.src || '';

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
// ]]>

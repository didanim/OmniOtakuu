// <![CDATA[
document.addEventListener('click', function(e) {
  const trigger = e.target.closest('cite.user, .message-cell-user');
  
  if (trigger) {
    e.preventDefault();
    
    const cite = trigger.tagName === 'CITE' ? trigger : trigger.querySelector('cite.user');
    
    if (!cite) return; 

    const profileUrl = cite.getAttribute('data') || '';
    const authorName = cite.innerText;
    
    const commentWrapper = trigger.closest('.comment-inner, .comment-header, .message-cell-user');
    const authorImg = commentWrapper?.querySelector('img')?.src || '';
    const badgeHTML = commentWrapper?.querySelector('.adminBadge')?.innerHTML || '';

    const idMatch = profileUrl.match(/profile\/(\d+)/);
    const profileId = idMatch ? idMatch[1] : null;

    if (profileId) {
      let views = localStorage.getItem('view_' + profileId);
      if (!views) {
        views = 1;
        localStorage.setItem('view_' + profileId, views);
      } else {
        views = parseInt(views);
      }

      showProfileModal(authorName, profileUrl, authorImg, profileId, views, badgeHTML);
    }
  }
});

async function showProfileModal(name, url, img, id, views, badge) {
  const modal = document.getElementById('profile-modal');
  modal.style.display = 'flex'; 
  
  document.getElementById('modal-name').innerText = name;
  document.getElementById('modal-avatar').src = img;
  document.getElementById('view-count').innerText = views;
  
  const bContainer = document.getElementById('modal-badge');
  bContainer.innerHTML = badge;
  bContainer.style.display = badge ? 'flex' : 'none';

  try {
    const res = await fetch(`/feeds/comments/default?alt=json&max-results=500`);
    const data = await res.json();
    const entries = data.feed.entry || [];

    let totalCount = 0, monthCount = 0, userBlogUrl = "";
    const now = new Date();

    entries.forEach(entry => {
      const author = entry.author[0];
      const authorUri = author.uri ? author.uri.$t : "";

      if (authorUri.includes(id)) {
        totalCount++;
        if (!userBlogUrl && authorUri && !authorUri.includes("blogger.com/profile")) {
            userBlogUrl = authorUri;
        }
        const pubDate = new Date(entry.published.$t);
        if (pubDate.getMonth() === now.getMonth() && pubDate.getFullYear() === now.getFullYear()) {
          monthCount++;
        }
      }
    });

    document.getElementById('total-count').innerText = totalCount;
    document.getElementById('month-count').innerText = monthCount;
    document.getElementById('total-points').innerText = totalCount * 2;

    const blogElem = document.getElementById('modal-link');
    blogElem.href = userBlogUrl || url;
    blogElem.innerText = userBlogUrl ? userBlogUrl.replace(/^https?:\/\//, '').split('/')[0] : "Link";
    
  } catch (err) {
    console.error("Modal Data Error:", err);
  }
}

document.querySelector('.close-modal').onclick = () => {
  document.getElementById('profile-modal').style.display = 'none';
};

window.onclick = (e) => {
  const modal = document.getElementById('profile-modal');
  if (e.target == modal) modal.style.display = 'none';
};
// ]]>

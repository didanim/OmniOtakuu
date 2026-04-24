const kaoaniMap = {
  ':)': 'https://didanim.github.io/OmniOtakuu/emote/smile.gif',
  ';)': 'https://didanim.github.io/OmniOtakuu/emote/wink.gif',
  'XD': 'https://didanim.github.io/OmniOtakuu/emote/laughing.gif',
  'X(': 'https://didanim.github.io/OmniOtakuu/emote/eksD.gif',
  ':D': 'https://didanim.github.io/OmniOtakuu/emote/happy.gif',
  ':O': 'https://didanim.github.io/OmniOtakuu/emote/shock.gif',
  ':p': 'https://didanim.github.io/OmniOtakuu/emote/blee.gif',
  ':'(': 'https://didanim.github.io/OmniOtakuu/emote/crying.gif',
  ':(': 'https://didanim.github.io/OmniOtakuu/emote/slightsad.gif',
  '>:(': 'https://didanim.github.io/OmniOtakuu/emote/angry.gif',
  ':/': 'https://didanim.github.io/OmniOtakuu/emote/mood.gif',
  ':*': 'https://didanim.github.io/OmniOtakuu/emote/kisskiss.gif',
  '<3': 'https://didanim.github.io/OmniOtakuu/emote/heart.gif'
};

function applyKaoani(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  let textNode;
  const nodesToReplace = [];

  while (textNode = walker.nextNode()) {
    if (Object.keys(kaoaniMap).some(key => textNode.nodeValue.includes(key))) {
      nodesToReplace.push(textNode);
    }
  }

  nodesToReplace.forEach(node => {
    let content = node.nodeValue;
    const sortedKeys = Object.keys(kaoaniMap).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(emo => {
      const escaped = emo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      const imgHtml = `<img src="${kaoaniMap[emo]}" class="kaoani-emo" alt="${emo}" title="${emo}" />`;
      content = content.replace(regex, imgHtml);
    });

    const replacement = document.createElement('span');
    replacement.innerHTML = content;
    node.parentNode.replaceChild(replacement, node);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.comment-body');
  targets.forEach(target => applyKaoani(target));
});

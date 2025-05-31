export default class Comments { // steven savarin W04
  constructor(productId) {
    this.productId = productId;
  }

  init() {
    this.loadComments();
    document.getElementById('addCommentBtn').addEventListener('click', this.addComment.bind(this));
  }

  getComments() {
    const allComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    return allComments[this.productId] || [];
  }

  saveComment(comment) {
    const allComments = JSON.parse(localStorage.getItem('productComments') || '{}');
    if (!allComments[this.productId]) {
      allComments[this.productId] = [];
    }
    allComments[this.productId].push(comment);
    localStorage.setItem('productComments', JSON.stringify(allComments));
  }

  loadComments() {
    const comments = this.getComments();
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = "";

    if (comments.length === 0) {
      commentsList.textContent = "No comments yet.";
      return;
    }

    comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.classList.add('comment');
      commentEl.textContent = comment;
      commentsList.appendChild(commentEl);
    });
  }

  addComment() {
  const textarea = document.getElementById('newComment');
  const comment = textarea.value.trim();
  if (!comment) return alert("Please write a comment.");

  if (comment.length > 120) {
    return alert("The comment cannot be longer than 120 characters.");
  }

  this.saveComment(comment);
  textarea.value = "";
  this.loadComments();
}
}

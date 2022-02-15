// Client facing scripts here
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(function () {

  $(".get-comment").on("submit", function (e) {
    e.preventDefault();

    //To preserve the context of which comment submission we're acting on
    let $form = $(this);

    //gets the resource id froom the form data attribute, so we can identify the dynamic post
    let resourceid = $(this).data('resource-id');

    //gets submitted comment from the form
    const formData = {
      postID: resourceid,
      comment: $form.find("textarea.comment-text").val() // retrieves the text from the specific textarea tied to the post
    };

    const textAreaStatus = $form.find("textarea.comment-text").val().trim();

    if (textAreaStatus.length < 1) {
      $('.form-error')
        .html('<i class="fa fa-exclamation-triangle"></i>&nbsp;Please enter some text to comment&nbsp;<i class="fa fa-exclamation-triangle"></i>')
        .slideDown(400);
      return;
    }

    //sends comment to post route for processing + saving
    $.ajax({
      url: "/api/resources/comments",
      method: "POST",
      data: formData,
      success: function (response) {
        $('.comment-text').val('');

        loadComments(resourceid);
      },
      error: function (response) {
      }
    });

  });

  //end submit function

  // makes a request to the get route to retrieve all comments
  const loadComments = function (resourceid) {
    $.ajax({
      url: `/api/resources/comments/${resourceid}`,
      method: "GET",
      success: function (data) {
        for (let i = data.length - 1; i >= 0; i--) {
          // creates and appends retrieved comments
          createCommentSection(data[i], resourceid);
        }
      },
      error: function (data) {
        console.log(data);
      }
    });
  }

  //load existing comments, runs everytime the page loads
  $('.comment-listing').each(function () {
    let id = $(this).data('resource-id');
    loadComments(id);
  });

  const createCommentSection = function (commentData, resourceid) {
    //Checks if avatars exist in the users schema, Retrieve users avatar if exists, else assign placeholder image
    const imageDisplay = `<span class ="fa-solid fa-user-astronaut"> </span>`;
    let comment = "";

    //create and append comment
    comment = `<article>
      <header class="articles-header">
        <div class = "profile-details">
          <h3>${imageDisplay}</h3>
        </div>
        <div class="username">
          <h3>${commentData.name}</h3>
        </div>
      </header>

      </header>
      <p>${commentData.comment}</p>
      <hr>
      <footer>
        <div>
          <output name="postDate" class="postDate">${commentData.created_at}</output>
        </div>
        <div class="flags">
          <a href="#"><span class="fa-solid fa-flag"></span></a>
          <a href="#"><span class="fa-solid fa-recomment"></span></a>
          <a href="#"><span class="fa-solid fa-heart"></span></a>
        </div>
      </footer>
    </article>`;

    // if (commentData.comment == "" ) {
    //   comment = "<p><em>No comments added yet.<br>Be the first to comment!</em></p>";
    // }
    //Appends the contents to dynamically created elements, ensures the right comments are appended to the right posts.
    $('#comment-listing-' + resourceid).append(comment);
  }
});
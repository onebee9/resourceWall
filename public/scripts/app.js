// Client facing scripts here
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/*jQuery Timeago Plugin Copyright jQuery Foundation and other contributors
 * Released under the MIT license*/
!(function (t) {
  "function" == typeof define && define.amd
    ? define(["jquery"], t)
    : "object" == typeof module && "object" == typeof module.exports
    ? t(require("jquery"))
    : t(jQuery);
})(function (t) {
  t.timeago = function (e) {
    return e instanceof Date
      ? n(e)
      : n(
          "string" == typeof e
            ? t.timeago.parse(e)
            : "number" == typeof e
            ? new Date(e)
            : t.timeago.datetime(e)
        );
  };
  var e = t.timeago;
  t.extend(t.timeago, {
    settings: {
      refreshMillis: 6e4,
      allowPast: !0,
      allowFuture: !1,
      localeTitle: !1,
      cutoff: 0,
      autoDispose: !0,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: "any moment now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: [],
      },
    },
    inWords: function (e) {
      if (!this.settings.allowPast && !this.settings.allowFuture)
        throw "timeago allowPast and allowFuture settings can not both be set to false.";
      var i = this.settings.strings,
        a = i.prefixAgo,
        n = i.suffixAgo;
      if (
        (this.settings.allowFuture &&
          e < 0 &&
          ((a = i.prefixFromNow), (n = i.suffixFromNow)),
        !this.settings.allowPast && e >= 0)
      )
        return this.settings.strings.inPast;
      var r = Math.abs(e) / 1e3,
        o = r / 60,
        s = o / 60,
        u = s / 24,
        m = u / 365;
      function l(a, n) {
        var r = t.isFunction(a) ? a(n, e) : a,
          o = (i.numbers && i.numbers[n]) || n;
        return r.replace(/%d/i, o);
      }
      var d =
          (r < 45 && l(i.seconds, Math.round(r))) ||
          (r < 90 && l(i.minute, 1)) ||
          (o < 45 && l(i.minutes, Math.round(o))) ||
          (o < 90 && l(i.hour, 1)) ||
          (s < 24 && l(i.hours, Math.round(s))) ||
          (s < 42 && l(i.day, 1)) ||
          (u < 30 && l(i.days, Math.round(u))) ||
          (u < 45 && l(i.month, 1)) ||
          (u < 365 && l(i.months, Math.round(u / 30))) ||
          (m < 1.5 && l(i.year, 1)) ||
          l(i.years, Math.round(m)),
        h = i.wordSeparator || "";
      return void 0 === i.wordSeparator && (h = " "), t.trim([a, d, n].join(h));
    },
    parse: function (e) {
      var i = t.trim(e);
      return (
        (i = (i = (i = (i = (i = i.replace(/\.\d+/, ""))
          .replace(/-/, "/")
          .replace(/-/, "/"))
          .replace(/T/, " ")
          .replace(/Z/, " UTC")).replace(
          /([\+\-]\d\d)\:?(\d\d)/,
          " $1$2"
        )).replace(/([\+\-]\d\d)$/, " $100")),
        new Date(i)
      );
    },
    datetime: function (i) {
      var a = e.isTime(i) ? t(i).attr("datetime") : t(i).attr("title");
      return e.parse(a);
    },
    isTime: function (e) {
      return "time" === t(e).get(0).tagName.toLowerCase();
    },
  });
  var i = {
    init: function () {
      i.dispose.call(this);
      var n = t.proxy(a, this);
      n();
      var r = e.settings;
      r.refreshMillis > 0 &&
        (this._timeagoInterval = setInterval(n, r.refreshMillis));
    },
    update: function (i) {
      var n = i instanceof Date ? i : e.parse(i);
      t(this).data("timeago", { datetime: n }),
        e.settings.localeTitle && t(this).attr("title", n.toLocaleString()),
        a.apply(this);
    },
    updateFromDOM: function () {
      t(this).data("timeago", {
        datetime: e.parse(
          e.isTime(this) ? t(this).attr("datetime") : t(this).attr("title")
        ),
      }),
        a.apply(this);
    },
    dispose: function () {
      this._timeagoInterval &&
        (window.clearInterval(this._timeagoInterval),
        (this._timeagoInterval = null));
    },
  };
  function a() {
    var i = e.settings;
    if (i.autoDispose && !t.contains(document.documentElement, this))
      return t(this).timeago("dispose"), this;
    var a = (function (i) {
      if (!(i = t(i)).data("timeago")) {
        i.data("timeago", { datetime: e.datetime(i) });
        var a = t.trim(i.text());
        e.settings.localeTitle
          ? i.attr("title", i.data("timeago").datetime.toLocaleString())
          : !(a.length > 0) ||
            (e.isTime(i) && i.attr("title")) ||
            i.attr("title", a);
      }
      return i.data("timeago");
    })(this);
    return (
      isNaN(a.datetime) ||
        (0 === i.cutoff || Math.abs(r(a.datetime)) < i.cutoff
          ? t(this).text(n(a.datetime))
          : t(this).attr("title").length > 0 &&
            t(this).text(t(this).attr("title"))),
      this
    );
  }
  function n(t) {
    return e.inWords(r(t));
  }
  function r(t) {
    return new Date().getTime() - t.getTime();
  }
  (t.fn.timeago = function (t, e) {
    var a = t ? i[t] : i.init;
    if (!a) throw new Error("Unknown function name '" + t + "' for timeago");
    return (
      this.each(function () {
        a.call(this, e);
      }),
      this
    );
  }),
    document.createElement("abbr"),
    document.createElement("time");
});
/*jQuery Timeago Plugin*/

$(document).ready(function () {
  $(".get-comment").on("submit", function (e) {
    e.preventDefault();

    //To preserve the context of which comment submission we're acting on
    let $form = $(this);

    //gets the resource id froom the form data attribute, so we can identify the dynamic post
    let resourceid = $(this).data("resource-id");

    //gets submitted comment from the form
    const formData = {
      postID: resourceid,
      comment: $form.find("textarea.comment-text").val(), // retrieves the text from the specific textarea tied to the post
    };

    const textAreaStatus = $form.find("textarea.comment-text").val().trim();

    if (textAreaStatus.length < 1) {
      $(".form-error")
        .html(
          '<i class="fa fa-exclamation-triangle"></i>&nbsp;Please enter some text to comment&nbsp;<i class="fa fa-exclamation-triangle"></i>'
        )
        .slideDown(400);
      return;
    }

    //sends comment to post route for processing + saving
    $.ajax({
      url: "/resources/comments",
      method: "POST",
      data: formData,
      success: function (response) {
        $(".comment-text").val("");

        loadComments(resourceid);
      },
      error: function (response) {},
    });
  });

  //end submit function

  // makes a request to the get route to retrieve all comments
  const loadComments = function (resourceid) {
    $.ajax({
      url: `/resources/comments/${resourceid}`,
      method: "GET",
      success: function (data) {
        for (let i = data.length - 1; i >= 0; i--) {
          // creates and appends retrieved comments
          createCommentSection(data[i], resourceid);
        }
      },
      error: function (data) {
        console.log(data);
      },
    });
  };

  //load existing comments, runs everytime the page loads
  $(".comment-listing").each(function () {
    let id = $(this).data("resource-id");
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
          <span>${imageDisplay}</span>
          <span>${commentData.name}</span>
        </div>
        <div>
          <time name="postDate" class="commentdate" datetime="${commentData.created_at}">${commentData.created_at}</time>
        </div>
      </header>
      <p>${commentData.comment}</p>
    </article>`;

    // if (commentData.comment == "" ) {
    //   comment = "<p><em>No comments added yet.<br>Be the first to comment!</em></p>";
    // }
    //Appends the contents to dynamically created elements, ensures the right comments are appended to the right posts.
    $("#comment-listing-" + resourceid).append(comment);
    $("time.commentdate").timeago();
  };

  /*star rating inspiration from https://codepen.io/depy/pen/vEWWdw */
  /* 1. Visualizing things on Hover - */

  $(".the-stars li")
    .on("mouseover", function () {
      let onStar = parseInt($(this).data("value"), 10); // The star currently mouse on

      // Now highlight all the stars that's not after the current hovered star
      $(this)
        .parent()
        .children("li.star")
        .each(function (e) {
          if (e < onStar) {
            $(this).addClass("hover");
          } else {
            $(this).removeClass("hover");
          }
        });
    })
    .on("mouseout", function () {
      $(this)
        .parent()
        .children("li.star")
        .each(function (e) {
          $(this).removeClass("hover");
        });
    });

  /* 2. Action to perform on click */
  $(".the-stars li").on("click", function () {
    let onStar = parseInt($(this).data("value"), 10); // The star currently selected
    let stars = $(this).parent().children("li.star");

    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass("selected");
    }

    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass("selected");
    }
  });

  // resource like icon event handling
  $(".heart").on("click", function (e) {
    e.preventDefault();

    const id = $(this).attr("data-resource-id");

    $.ajax({
      url: "/resources/likes",
      method: "POST",
      data: { postID: id },
      success: function (response) {
        console.log("Success");
      },
    });

    if ($(this).hasClass("liked")) {
      $(this).html('<i class="fa-regular fa-heart"></i>');
      $(this).removeClass("liked");

      // adding liked resource to the db
    } else {
      $(this).html('<i class="fa fa-heart"></i>');
      $(this).addClass("liked");
      // removing it from the db
    }
  });
});

// inesert a new row into the likes table with the resource id and the user Id

// post the liked resource to the db

// on the proflie page, get all the liked resources that match the user id

(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{620:function(t,e,r){var content=r(627);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("47784bc8",content,!0,{sourceMap:!1})},621:function(t,e,r){var content=r(629);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(14).default)("e030b244",content,!0,{sourceMap:!1})},623:function(t,e,r){"use strict";r.r(e);r(18),r(82);var o=r(19),n=r(624),c=(r(216),r(217)),l={name:"TrailerDialog",components:{VueYoutube:r.n(c).a},props:{trailerUrl:String},data:function(){return{videoId:this.trailerUrl}}},d=r(53),v=Object(d.a)(l,(function(){var t=this.$createElement;return(this._self._c||t)("youtube",{ref:"youtube",attrs:{"video-id":this.videoId,"player-vars":{autoplay:1}}})}),[],!1,null,"2245a451",null).exports,m={name:"MovieCard",components:{ShowsView:n.default},props:{movie:{movId:Number,name:String,posterUrl:String,director:String,description:String},small:Boolean,shows:Array,showView:Boolean,noLink:Boolean,transparent:Boolean,loading:Boolean},methods:{openTrailer:function(t){var e=this;return Object(o.a)(regeneratorRuntime.mark((function r(){var o,n;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.$repos.movies.trailer(t);case 2:return o=r.sent,console.log(o),r.next=6,e.$dialog.showAndWait(v,{trailerUrl:o,width:"630"}).then((function(t){return t}));case 6:n=r.sent,console.log("trailer",n);case 8:case"end":return r.stop()}}),r)})))()}}},f=(r(628),r(65)),h=r.n(f),w=r(106),_=r(613),y=r(130),k=r(170),V=r(127),x=r(207),S=r(93),C=r(617),I=r(640),j=r(593),L=Object(d.a)(m,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.loading?r("v-skeleton-loader",{attrs:{type:"card",loading:""}}):r("div",[r("v-list-item",{class:{"elevation-2":!t.transparent,"rounded-lg":!0,"card-wrapper":!t.noLink,"card-wrapper-noHover":!0===t.noLink,"pa-0":!0,"m-0":!0},attrs:{"three-line":"",to:t.noLink?null:"/movies/"+t.movie.movId}},[r("v-list-item-avatar",{class:{"ma-0":!0,"pa-0":!0,"mr-4":!0,"card-avatar":!0===t.noLink},attrs:{rounded:"0",height:!0===t.small?180:370,width:!0===t.small?120:240,"max-height":"370","max-width":"240",horizontal:""}},[r("v-img",{class:{"card-img":!0,"rounded-l-lg":!t.small},staticStyle:{height:"100%!important"},attrs:{src:t.movie.posterUrl}})],1),t._v(" "),r("v-list-item-content",{staticClass:"movie-details"},[r("v-list-item-title",{staticClass:"movie-title"},[t._v(t._s(t.movie.name))]),t._v(" "),r("v-list-item-subtitle",{staticClass:"post-description"},[t._v(t._s(t.movie.description))]),t._v(" "),r("v-row",{attrs:{justify:"start"}},[t.showView?r("shows-view",{attrs:{loading:t.loading,shows:t.shows,"mov-id":t.movie.movId}}):t._e()],1),t._v(" "),r("v-list-item-title",{staticClass:"post-author"},[r("v-row",{attrs:{dense:"","no-gutters":"",justify:"space-between"}},[r("v-col",{attrs:{cols:"9"}},[t._v("\n            Directed by "+t._s(t.movie.director)+"\n          ")]),t._v(" "),r("v-spacer"),t._v(" "),!0!==t.noLink?r("v-col",[r("v-btn",{attrs:{icon:""},on:{click:function(e){return e.preventDefault(),t.openTrailer(t.movie.movId)}}},[r("v-icon",[t._v("fas fa-video")])],1)],1):t._e()],1)],1)],1)],1)],1)}),[],!1,null,"aea1e1d6",null);e.default=L.exports;h()(L,{ShowsView:r(624).default}),h()(L,{VBtn:w.a,VCol:_.a,VIcon:y.a,VImg:k.a,VListItem:V.a,VListItemAvatar:x.a,VListItemContent:S.a,VListItemSubtitle:S.b,VListItemTitle:S.c,VRow:C.a,VSkeletonLoader:I.a,VSpacer:j.a})},624:function(t,e,r){"use strict";r.r(e);r(24),r(18);var o=r(99),n={name:"ShowsView",props:{shows:Array,movId:Number,loading:Boolean},computed:{days:{get:function(){var t=o.a.groupByDay(this.shows);return console.log("DAYS",t),t}}},methods:{goToShow:function(t){this.$router.push("/movies/".concat(this.movId,"/shows/").concat(t.showId))}}},c=(r(626),r(53)),l=r(65),d=r.n(l),v=r(617),m=r(669),f=r(640),component=Object(c.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticStyle:{overflow:"hidden"}},[t.loading?r("v-skeleton-loader",{attrs:{type:"table"}}):r("v-simple-table",{staticClass:"shows-table",attrs:{dense:""},scopedSlots:t._u([{key:"default",fn:function(){return[r("thead",[r("tr",t._l(t.days,(function(e,o){return r("th",{staticStyle:{width:"30px!important"}},[t._v("\n          "+t._s(t._f("formatDateName")(o))+"\n        ")])})),0)]),t._v(" "),r("tbody",[r("tr",t._l(t.days,(function(e){return r("td",t._l(e,(function(e){return r("v-row",{attrs:{dense:"",justify:"start",align:"start"}},[r("div",{staticClass:"show-item",on:{click:function(r){return t.goToShow(e)}}},[r("p",[t._v("\n                "+t._s(t._f("formatTime")(e.date))+"\n              ")])])])})),1)})),0)])]},proxy:!0}])})],1)}),[],!1,null,"c77b6cdc",null);e.default=component.exports;d()(component,{VRow:v.a,VSimpleTable:m.a,VSkeletonLoader:f.a})},626:function(t,e,r){"use strict";var o=r(620);r.n(o).a},627:function(t,e,r){(e=r(13)(!1)).push([t.i,".v-data-table tbody tr[data-v-c77b6cdc]:hover:not(.v-data-table__expanded__content){background:transparent!important}.show-item[data-v-c77b6cdc]{width:6em;height:2em;text-align:center;background-color:rgba(199,57,57,.3);margin-bottom:.1rem}.show-item[data-v-c77b6cdc]:hover{cursor:pointer;background-color:rgba(199,57,57,.6)}.show-item p[data-v-c77b6cdc]{color:#600}",""]),t.exports=e},628:function(t,e,r){"use strict";var o=r(621);r.n(o).a},629:function(t,e,r){(e=r(13)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Roboto:400,700);"]),e.push([t.i,"*[data-v-aea1e1d6],[data-v-aea1e1d6]:after,[data-v-aea1e1d6]:before{box-sizing:border-box}.movie-card[data-v-aea1e1d6]{display:flex;flex-direction:row;background:#fff;box-shadow:0 .1875rem 1.5rem rgba(0,0,0,.2);border-radius:.375rem;overflow:hidden}.transparent-card[data-v-aea1e1d6]{background:transparent;box-shadow:none;border-radius:0}.card-wrapper[data-v-aea1e1d6]{background:#fff}.card-wrapper[data-v-aea1e1d6]:hover{cursor:pointer}.card-wrapper:hover .movie-title[data-v-aea1e1d6]{transition:color .3s ease;color:#e04f62}.card-wrapper:hover .card-img[data-v-aea1e1d6]{transition:opacity .3s ease;opacity:.75}.card-avatar[data-v-aea1e1d6]{transition:width 1s}.card-wrapper-noHover:hover *[data-v-aea1e1d6]{cursor:auto}.card-wrapper-noHover[data-v-aea1e1d6]:hover{background:#fff}.movie-title[data-v-aea1e1d6]{display:inline-block;text-transform:uppercase;letter-spacing:.0625rem;padding:0 0 .25rem;border-bottom:.125rem solid #ebebeb;transition:color .3s ease;font-size:1.125rem;line-height:1.4;color:#121212;font-weight:700;margin:0 0 .5rem}.post-author[data-v-aea1e1d6]{font-size:.875rem;line-height:1;margin:1.125rem 0 0;padding:1.125rem 0 0;border-top:.0625rem solid #ebebeb}",""]),t.exports=e},727:function(t,e,r){"use strict";r.r(e);r(43),r(82);var o=r(19),n={name:"index.vue",components:{MovieCard:r(623).default},data:function(){return{movies:[],fetchHint:""}},fetch:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return setTimeout((function(){return t.fetchHint="Hint: The Backend was probably put in sleep mode, it takes additional time to wake it up"}),6e3),e.next=3,t.$repos.movies.all();case 3:t.movies=e.sent,console.log("movies",t.movies),t.fetchHint="";case 6:case"end":return e.stop()}}),e)})))()},head:function(){return{title:"Movies"}}},c=r(53),l=r(65),d=r.n(l),v=r(613),m=r(619),f=r(204),h=r(203),w=r(617),_=r(593),y=r(173),component=Object(c.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",{attrs:{fluid:""}},[r("v-row",{attrs:{justify:"center"}},[r("v-toolbar-title",[t._v("Movies")])],1),t._v(" "),t.$fetchState.pending?r("v-row",[r("v-container",[r("v-row",{attrs:{justify:"center"}},[r("v-progress-circular",{attrs:{size:80,color:"primary",indeterminate:""}})],1),t._v(" "),r("v-row",{attrs:{justify:"center"}},[r("h4",[t._v("Fetching Movies...")])]),t._v(" "),r("v-row",{staticClass:"mt-4",attrs:{justify:"center"}},[r("h5",[t._v(t._s(t.fetchHint))])])],1)],1):t.$fetchState.error?r("v-row",[r("v-container",[r("v-row",{attrs:{justify:"center"}},[r("h4",[t._v("An error while fetching from the backend occurred, make sure its running!")])])],1)],1):r("v-row",{attrs:{justify:"center"}},[r("v-col",[r("v-list",t._l(t.movies,(function(e,i){return r("movie-card",{key:"movieCard"+i,staticClass:"mb-4",attrs:{movie:e,"show-view":!1,loading:t.$fetchState.pending}})})),1),t._v(" "),r("v-spacer")],1)],1)],1)}),[],!1,null,"21739f6f",null);e.default=component.exports;d()(component,{MovieCard:r(623).default}),d()(component,{VCol:v.a,VContainer:m.a,VList:f.a,VProgressCircular:h.a,VRow:w.a,VSpacer:_.a,VToolbarTitle:y.b})}}]);
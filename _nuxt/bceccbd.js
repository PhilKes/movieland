(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{620:function(e,t,r){var content=r(627);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(14).default)("47784bc8",content,!0,{sourceMap:!1})},621:function(e,t,r){var content=r(629);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(14).default)("e030b244",content,!0,{sourceMap:!1})},623:function(e,t,r){"use strict";r.r(t);r(18),r(82);var o=r(19),n=r(624),l=(r(216),r(217)),c={name:"TrailerDialog",components:{VueYoutube:r.n(l).a},props:{trailerUrl:String},data:function(){return{videoId:this.trailerUrl}}},d=r(53),v=Object(d.a)(c,(function(){var e=this.$createElement;return(this._self._c||e)("youtube",{ref:"youtube",attrs:{"video-id":this.videoId,"player-vars":{autoplay:1}}})}),[],!1,null,"2245a451",null).exports,m={name:"MovieCard",components:{ShowsView:n.default},props:{movie:{movId:Number,name:String,posterUrl:String,director:String,description:String},small:Boolean,shows:Array,showView:Boolean,noLink:Boolean,transparent:Boolean,loading:Boolean},methods:{openTrailer:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){var o,n;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,t.$repos.movies.trailer(e);case 2:return o=r.sent,console.log(o),r.next=6,t.$dialog.showAndWait(v,{trailerUrl:o,width:"630"}).then((function(e){return e}));case 6:n=r.sent,console.log("trailer",n);case 8:case"end":return r.stop()}}),r)})))()}}},h=(r(628),r(65)),f=r.n(h),w=r(106),_=r(613),x=r(130),k=r(170),y=r(127),V=r(207),S=r(93),T=r(617),D=r(640),M=r(593),I=Object(d.a)(m,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.loading?r("v-skeleton-loader",{attrs:{type:"card",loading:""}}):r("div",[r("v-list-item",{class:{"elevation-2":!e.transparent,"rounded-lg":!0,"card-wrapper":!e.noLink,"card-wrapper-noHover":!0===e.noLink,"pa-0":!0,"m-0":!0},attrs:{"three-line":"",to:e.noLink?null:"/movies/"+e.movie.movId}},[r("v-list-item-avatar",{class:{"ma-0":!0,"pa-0":!0,"mr-4":!0,"card-avatar":!0===e.noLink},attrs:{rounded:"0",height:!0===e.small?180:370,width:!0===e.small?120:240,"max-height":"370","max-width":"240",horizontal:""}},[r("v-img",{class:{"card-img":!0,"rounded-l-lg":!e.small},staticStyle:{height:"100%!important"},attrs:{src:e.movie.posterUrl}})],1),e._v(" "),r("v-list-item-content",{staticClass:"movie-details"},[r("v-list-item-title",{staticClass:"movie-title"},[e._v(e._s(e.movie.name))]),e._v(" "),r("v-list-item-subtitle",{staticClass:"post-description"},[e._v(e._s(e.movie.description))]),e._v(" "),r("v-row",{attrs:{justify:"start"}},[e.showView?r("shows-view",{attrs:{loading:e.loading,shows:e.shows,"mov-id":e.movie.movId}}):e._e()],1),e._v(" "),r("v-list-item-title",{staticClass:"post-author"},[r("v-row",{attrs:{dense:"","no-gutters":"",justify:"space-between"}},[r("v-col",{attrs:{cols:"9"}},[e._v("\n            Directed by "+e._s(e.movie.director)+"\n          ")]),e._v(" "),r("v-spacer"),e._v(" "),!0!==e.noLink?r("v-col",[r("v-btn",{attrs:{icon:""},on:{click:function(t){return t.preventDefault(),e.openTrailer(e.movie.movId)}}},[r("v-icon",[e._v("fas fa-video")])],1)],1):e._e()],1)],1)],1)],1)],1)}),[],!1,null,"aea1e1d6",null);t.default=I.exports;f()(I,{ShowsView:r(624).default}),f()(I,{VBtn:w.a,VCol:_.a,VIcon:x.a,VImg:k.a,VListItem:y.a,VListItemAvatar:V.a,VListItemContent:S.a,VListItemSubtitle:S.b,VListItemTitle:S.c,VRow:T.a,VSkeletonLoader:D.a,VSpacer:M.a})},624:function(e,t,r){"use strict";r.r(t);r(24),r(18);var o=r(99),n={name:"ShowsView",props:{shows:Array,movId:Number,loading:Boolean},computed:{days:{get:function(){var e=o.a.groupByDay(this.shows);return console.log("DAYS",e),e}}},methods:{goToShow:function(e){this.$router.push("/movies/".concat(this.movId,"/shows/").concat(e.showId))}}},l=(r(626),r(53)),c=r(65),d=r.n(c),v=r(617),m=r(669),h=r(640),component=Object(l.a)(n,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticStyle:{overflow:"hidden"}},[e.loading?r("v-skeleton-loader",{attrs:{type:"table"}}):r("v-simple-table",{staticClass:"shows-table",attrs:{dense:""},scopedSlots:e._u([{key:"default",fn:function(){return[r("thead",[r("tr",e._l(e.days,(function(t,o){return r("th",{staticStyle:{width:"30px!important"}},[e._v("\n          "+e._s(e._f("formatDateName")(o))+"\n        ")])})),0)]),e._v(" "),r("tbody",[r("tr",e._l(e.days,(function(t){return r("td",e._l(t,(function(t){return r("v-row",{attrs:{dense:"",justify:"start",align:"start"}},[r("div",{staticClass:"show-item",on:{click:function(r){return e.goToShow(t)}}},[r("p",[e._v("\n                "+e._s(e._f("formatTime")(t.date))+"\n              ")])])])})),1)})),0)])]},proxy:!0}])})],1)}),[],!1,null,"c77b6cdc",null);t.default=component.exports;d()(component,{VRow:v.a,VSimpleTable:m.a,VSkeletonLoader:h.a})},625:function(e,t,r){"use strict";r.r(t);r(8),r(62),r(33),r(30),r(424),r(9),r(82);var o=r(19),n=(r(216),r(18),r(176),r(10),r(21),r(1)),l=r.n(n),c=(r(99),{name:"MovieDetails",components:{MovieCard:r(623).default},props:{movie:Object,stats:Object},data:function(){var e=this,t={legend:{show:!1},yaxis:[{seriesName:"Grossing",labels:{formatter:function(e){return Number(e).toFixed(2)+"$"}}},{seriesName:"Tickets sold",opposite:!0,labels:{formatter:function(e){return Number(e).toFixed(0)}}}],chart:{type:"line",width:"500px",zoom:{enabled:!1}},colors:["var(--v-primary-base)","var(--v-secondary-base)"],markers:{size:6,colors:["var(--v-primary-lighten2)","var(--v-secondary-lighten2)"]},labels:[]},r=[{name:"Grossing",data:[]},{name:"Tickets",data:[]}];return Object.keys(this.stats).forEach((function(o){t.labels.push(l()(o).format("DD.MM")),r[0].data.push(e.stats[o].grossing),r[1].data.push(e.stats[o].visitors)})),console.log("stats",this.stats),{loading:!1,chartOptions:t,series:r}},computed:{apexchart:function(){return function(){return r.e(4).then(r.t.bind(null,716,7))}}}}),d=r(53),v=r(65),m=r.n(v),h=r(106),f=r(109),w=r(54),_=r(613),x=r(617),k=r(640),y=r(593),component=Object(d.a)(c,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-card",{staticClass:"dialog-card"},[!0===e.loading?r("v-skeleton-loader",{attrs:{type:"card"}}):[r("v-row",{attrs:{dense:"","no-gutters":""}},[r("v-col",{attrs:{cols:"12"}},[r("movie-card",{attrs:{movie:e.movie,transparent:"","no-link":"",small:""}})],1)],1),e._v(" "),r("v-row",{attrs:{dense:"","no-gutters":""}},[r("v-col",{attrs:{cols:"12"}},[r("v-card-title",[e._v("Grossing and Sold Tickets Last 7 Days")]),e._v(" "),r("client-only",[r(e.apexchart,{tag:"component",attrs:{width:"575px",options:e.chartOptions,series:e.series}})],1)],1)],1),e._v(" "),r("v-card-actions",[r("v-spacer"),e._v(" "),r("v-btn",{attrs:{color:"info"},on:{click:function(t){return e.$emit("submit",!0)}}},[e._v("Ok")])],1)]],2)}),[],!1,null,"34aacebd",null),V=component.exports;m()(component,{MovieCard:r(623).default}),m()(component,{VBtn:h.a,VCard:f.a,VCardActions:w.a,VCardTitle:w.c,VCol:_.a,VRow:x.a,VSkeletonLoader:k.a,VSpacer:y.a});var S={name:"MoviesTable",props:{existingMovies:Array,repos:Object,noTmdb:Boolean,canDelete:Boolean,canAdd:Boolean,large:Boolean,singleSelect:Boolean,showDetails:Boolean},data:function(){var e=[{value:"posterUrl",text:"Poster",sortable:!1,width:"50px"},{value:"name",text:"Title"},{value:"date",text:"Date"}];return!0!==this.canDelete&&!0!==this.showDetails||e.push({text:"Actions",value:"actions",sortable:!1}),{selected:[],movies:[],loading:!0,search:"",headers:e}},mounted:function(){this.loadMovies()},watch:{existingMovies:function(e){this.loadMovies()}},methods:{loadMovies:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.loading=!0,!0===e.noTmdb){t.next=8;break}return t.next=4,e.repos.tmdb.topMovies();case 4:e.movies=t.sent,e.initMovieRows(),t.next=9;break;case 8:e.movies=e.existingMovies;case 9:e.loading=!1;case 10:case"end":return t.stop()}}),t)})))()},searchTmdb:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.loading=!0,t.prev=1,t.next=4,e.repos.tmdb.search(e.search);case 4:e.movies=t.sent,t.next=10;break;case 7:t.prev=7,t.t0=t.catch(1),e.$dialog.message.success("TMDB Searched returned an error",{position:"bottom-left",timeout:3e3,color:"error"});case 10:e.initMovieRows(),e.loading=!1;case 12:case"end":return t.stop()}}),t,null,[[1,7]])})))()},initMovieRows:function(){var e=this;null!=this.existingMovies&&this.movies.forEach((function(t,r){t.movId=r,t.selectable=!0,e.existingMovies.some((function(e){return e.name===t.name}))&&(t.selectable=!1)}))},showDetailsDialog:function(e){var t=this;return Object(o.a)(regeneratorRuntime.mark((function r(){var o;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t.loading=!0,r.next=3,t.$repos.statistics.getMovieStatsWeek(e.movId);case 3:o=r.sent,t.loading=!1,t.$dialog.show(V,{movie:e,stats:o,width:"600px"});case 6:case"end":return r.stop()}}),r)})))()}}},T=r(652),D=r(720),M=r(130),I=r(170),C=r(203),B=r(430),$=r(47),j=Object(d.a)(S,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-data-table",{staticClass:"elevation-1",attrs:{"show-select":"",loading:e.loading,headers:e.headers,items:e.movies,search:!0===e.noTmdb?e.search:null,"item-key":!0!==e.noTmdb?"tmdbId":"movId","selectable-key":"selectable","sort-desc":"","sort-by":!0!==e.noTmdb?null:"date","items-per-page":10,"single-select":!0===e.singleSelect},on:{"item-selected":function(t){return e.$emit("select",t)}},scopedSlots:e._u([{key:"top",fn:function(){return[r("v-toolbar",{attrs:{flat:""}},[r("v-text-field",{attrs:{disabled:e.loading,label:!0!==e.noTmdb?"Search Movies in TMDB":"Search","hide-details":"","append-icon":!0!==e.noTmdb?null:"fas fa-search"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),e._v(" "),!0!==e.noTmdb?r("v-btn",{attrs:{color:"success",disabled:e.search.length<1||e.loading},on:{click:e.searchTmdb}},[r("v-icon",[e._v("fas fa-search")])],1):e._e(),e._v(" "),r("v-spacer"),e._v(" "),!0===e.canDelete?r("v-btn",{staticClass:"mr-2",attrs:{color:"error",disabled:e.selected.length<1||e.loading},on:{click:function(t){return e.$emit("delete",e.selected)}}},[r("v-icon",[e._v("fas fa-trash")])],1):e._e(),e._v(" "),!0===e.canAdd?r("v-btn",{attrs:{color:"success",disabled:e.loading},on:{click:function(t){return e.$emit("add")}}},[r("v-icon",[e._v("fas fa-plus")])],1):e._e()],1)]},proxy:!0},{key:"item.name",fn:function(t){var o=t.item;return[[e._v("\n      "+e._s(o.name)+"\n      "),!0===e.showDetails?r("v-btn",{attrs:{color:"info",icon:"",elevation:"0",small:"",disabled:e.loading},on:{click:function(t){return e.showDetailsDialog(o)}}},[e.loading?r("v-progress-circular",{attrs:{indeterminate:"",size:"20"}}):r("v-icon",[e._v("fas fa-info-circle")])],1):e._e()],e._v(" "),!0===e.noTmdb||o.selectable?e._e():r("v-chip",{attrs:{disabled:""}},[e._v("Already Exists")])]}},{key:"item.posterUrl",fn:function(t){var o=t.item;return[r("v-img",{attrs:{src:o.posterUrl,"max-width":!0===e.large?"80":"50"}})]}},{key:"item.date",fn:function(t){var r=t.item;return[e._v("\n    "+e._s(e._f("formatDate")(r.date))+"\n  ")]}},{key:"item.actions",fn:function(t){var o=t.item;return[!0===e.canDelete?r("v-btn",{attrs:{color:"error",elevation:"0",disabled:e.loading,small:"",fab:""},on:{click:function(t){return e.$emit("delete",[o])}}},[r("v-icon",[e._v("mdi-delete")])],1):e._e()]}}]),model:{value:e.selected,callback:function(t){e.selected=t},expression:"selected"}})}),[],!1,null,"17955a7e",null);t.default=j.exports;m()(j,{VBtn:h.a,VChip:T.a,VDataTable:D.a,VIcon:M.a,VImg:I.a,VProgressCircular:C.a,VSpacer:y.a,VTextField:B.a,VToolbar:$.a})},626:function(e,t,r){"use strict";var o=r(620);r.n(o).a},627:function(e,t,r){(t=r(13)(!1)).push([e.i,".v-data-table tbody tr[data-v-c77b6cdc]:hover:not(.v-data-table__expanded__content){background:transparent!important}.show-item[data-v-c77b6cdc]{width:6em;height:2em;text-align:center;background-color:rgba(199,57,57,.3);margin-bottom:.1rem}.show-item[data-v-c77b6cdc]:hover{cursor:pointer;background-color:rgba(199,57,57,.6)}.show-item p[data-v-c77b6cdc]{color:#600}",""]),e.exports=t},628:function(e,t,r){"use strict";var o=r(621);r.n(o).a},629:function(e,t,r){(t=r(13)(!1)).push([e.i,"@import url(https://fonts.googleapis.com/css?family=Roboto:400,700);"]),t.push([e.i,"*[data-v-aea1e1d6],[data-v-aea1e1d6]:after,[data-v-aea1e1d6]:before{box-sizing:border-box}.movie-card[data-v-aea1e1d6]{display:flex;flex-direction:row;background:#fff;box-shadow:0 .1875rem 1.5rem rgba(0,0,0,.2);border-radius:.375rem;overflow:hidden}.transparent-card[data-v-aea1e1d6]{background:transparent;box-shadow:none;border-radius:0}.card-wrapper[data-v-aea1e1d6]{background:#fff}.card-wrapper[data-v-aea1e1d6]:hover{cursor:pointer}.card-wrapper:hover .movie-title[data-v-aea1e1d6]{transition:color .3s ease;color:#e04f62}.card-wrapper:hover .card-img[data-v-aea1e1d6]{transition:opacity .3s ease;opacity:.75}.card-avatar[data-v-aea1e1d6]{transition:width 1s}.card-wrapper-noHover:hover *[data-v-aea1e1d6]{cursor:auto}.card-wrapper-noHover[data-v-aea1e1d6]:hover{background:#fff}.movie-title[data-v-aea1e1d6]{display:inline-block;text-transform:uppercase;letter-spacing:.0625rem;padding:0 0 .25rem;border-bottom:.125rem solid #ebebeb;transition:color .3s ease;font-size:1.125rem;line-height:1.4;color:#121212;font-weight:700;margin:0 0 .5rem}.post-author[data-v-aea1e1d6]{font-size:.875rem;line-height:1;margin:1.125rem 0 0;padding:1.125rem 0 0;border-top:.0625rem solid #ebebeb}",""]),e.exports=t}}]);
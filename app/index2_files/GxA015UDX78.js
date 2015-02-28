/*!CK:1821715328!*//*1422856611,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["P96yp"]); }

__d("ChatMiniSidebarUser.react",["AvailableListConstants","ChatOpenTab","Image.react","Link.react","WebMessengerPermalinkConstants","ReactComponentWithPureRenderMixin","React","ReactLayeredComponentMixin","Tooltip","XUIAmbientNUX.react","cx","emptyFunction","ix","fbt"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){'use strict';var u=m.createClass({displayName:"ChatMiniSidebarUser",mixins:[l,n],propTypes:{context:m.PropTypes.string,detailedStatus:m.PropTypes.string,expanding:m.PropTypes.bool.isRequired,id:m.PropTypes.string.isRequired,isHighlighted:m.PropTypes.bool,isOffline:m.PropTypes.bool.isRequired,name:m.PropTypes.string.isRequired,onMouseLeave:m.PropTypes.func,onMouseOver:m.PropTypes.func,onNUXSeen:m.PropTypes.func,onOpenTab:m.PropTypes.func,section:m.PropTypes.string.isRequired,shouldShowNUX:m.PropTypes.bool,status:m.PropTypes.number.isRequired,statusTime:m.PropTypes.string,thumbSrc:m.PropTypes.string.isRequired},getDefaultProps:function(){return {onMouseLeave:r,onMouseOver:r,onNUXSeen:r};},_openTab:function(){h.openUserTab(this.props.id,this.props.section);this.props.onOpenTab&&this.props.onOpenTab();},_onClick:function(v){this._openTab();v.preventDefault();},_renderImage:function(){return m.createElement(i,{src:this.props.thumbSrc,alt:""});},_renderName:function(){if(!this.props.expanding)return null;return (m.createElement("div",{className:"_4rqx"},this.props.name));},_renderContext:function(){return (m.createElement("div",{className:"_4rqx _1hml"},this.props.context));},_renderStatus:function(){var v=null;if(this.props.status==g.ACTIVE){v=s('/images/litestand_classic/sidebar/online.png');}else if(this.props.status==g.MOBILE)v=s('/images/litestand_classic/sidebar/pushable.png');var w=v?m.createElement(i,{className:"_d9q",src:v}):null;return (m.createElement("div",{className:"_2sb6"},m.createElement("div",{className:"_d9r"},this.props.expanding?this.props.detailedStatus:null),m.createElement("div",{className:"_d9s"},this.props.expanding?this.props.statusTime:null),w));},_getHref:function(){return k.getURIPathForIDOrVanity(this.props.id);},renderLayers:function(){return {nux:(m.createElement(p,{alignment:"left",contextRef:"user",customwidth:234,position:"left",onCloseButtonClick:this.props.onNUXSeen,shown:this.props.shouldShowNUX,width:"custom"},"New! A chat sidebar for smaller screens. Click a photo to chat or hover to expand."))};},render:function(){return (m.createElement("li",{className:(("_2sb2")+(this.props.isOffline?' '+"_3maz":'')+(this.props.isHighlighted?' '+"_5aw":'')),onMouseLeave:this.props.onMouseLeave,onMouseOver:this.props.onMouseOver,ref:"user"},m.createElement(j,{className:"_2sb3",href:{url:this._getHref()},onClick:this._onClick,rel:"ignore"},m.createElement("div",{className:(("_2sb4")+(this.props.context?' '+"_1hmm":''))},m.createElement("div",m.__spread({},o.propsFor(this.props.expanding?'':this.props.name),{className:"_2sb5","data-tooltip-position":"left"}),this._renderImage()),this._renderName(),this._renderContext(),this._renderStatus()))));}});e.exports=u;},null);
__d("ChatMiniSidebarBody.react",["AsyncRequest","ChatConfig","ChatMiniSidebarUser.react","ChatMiniSidebarUserMixin","ChatSidebarSections","React","ScrollableArea.react","ShortProfiles","XUISpinner.react","XChatMiniSidebarNUXSeenController","cx","emptyFunction"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){'use strict';var s=l.createClass({displayName:"ChatMiniSidebarBody",mixins:[j],propTypes:{height:l.PropTypes.number.isRequired,expanding:l.PropTypes.bool,onMouseLeave:l.PropTypes.func,onMouseOver:l.PropTypes.func,onScroll:l.PropTypes.func,onOpenTab:l.PropTypes.func,users:l.PropTypes.array.isRequired},getDefaultProps:function(){return {expanding:false,onMouseLeave:r,onMouseOver:r,onScroll:r};},getInitialState:function(){return {loading:true,userData:[],showNUX:h.get('www_mini_sidebar_nux')&&!h.get('seen_mini_sidebar_nux')};},componentDidMount:function(){this._populateUserData(this.props.users);},componentWillReceiveProps:function(t){this._populateUserData(t.users);if(t.expanding!==this.props.expanding&&!h.get('seen_mini_sidebar_nux'))this._onNUXSeen();},_populateUserData:function(t){n.getMulti(t,function(u){var v=t.map(function(w){return u[w];});this.setState({loading:false,userData:v});}.bind(this));},_onNUXSeen:function(){this.setState({showNUX:false});h.set('seen_mini_sidebar_nux',true);var t=p.getURIBuilder().getURI();new g(t).send();},_renderUser:function(t,u){if(t.id=='0'||!t.is_friend)return null;var v=this.getStatus(t.id);return (l.createElement(i,{detailedStatus:v.detailedStatus,expanding:this.props.expanding,id:t.id,isOffline:v.offline,key:t.id,name:t.name,onMouseLeave:this.props.onMouseLeave,onMouseOver:this.props.onMouseOver,onNUXSeen:this._onNUXSeen,onOpenTab:this.props.onOpenTab,section:k.ORDERED_LIST,shouldShowNUX:u===0&&this.state.showNUX,status:v.status,statusTime:v.statusTime,thumbSrc:t.thumbSrc}));},render:function(){var t=null;if(this.state.loading){t=l.createElement("div",{className:"_1rg3"},l.createElement(o,null));}else t=l.createElement("ul",null,this.state.userData.map(function(u,v){return this._renderUser(u,v);}.bind(this)));return (l.createElement(m,{height:this.props.height,fade:true,onScroll:this.props.onScroll,persistent:true,shadow:false},t));}});e.exports=s;},null);
__d("ChatMiniSidebarFooter.react",["ChatConfig","ChatSidebarDropdown.react","ChatSidebarComposeLink.react","React","SearchableTextInput.react","cx","emptyFunction","fbt"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){'use strict';var o=g.get('mini_sidebar_hide_gear',false),p=j.createClass({displayName:"ChatMiniSidebarFooter",propTypes:{expanding:j.PropTypes.bool.isRequired,onClickPause:j.PropTypes.func.isRequired,onClickSearch:j.PropTypes.func.isRequired,onEntriesFound:j.PropTypes.func.isRequired,onInputChanged:j.PropTypes.func.isRequired,onKeyDown:j.PropTypes.func.isRequired,onMenuHide:j.PropTypes.func,onMenuShow:j.PropTypes.func,onQueryFinished:j.PropTypes.func,onToggleSidebar:j.PropTypes.func.isRequired,source:j.PropTypes.object.isRequired},getDefaultProps:function(){return {onQueryFinished:m};},getInitialState:function(){return {query:''};},componentWillReceiveProps:function(q){if(q.expanding!==this.props.expanding)this.setState({query:''});},componentDidUpdate:function(q,r){if(!q.expanding&&this.props.expanding&&this.refs.searchInput){setTimeout(this.refs.searchInput.focusInput,0);this.props.source.refreshData();}},_onClickSearch:function(q){q.preventDefault();this.props.onClickSearch(true,this.state.query);},_onChange:function(q){var r=q.target.value;this.setState({query:r});this.props.onInputChanged(r);},_onMenuHide:function(){if(!o)return;this.props.onMenuHide&&this.props.onMenuHide();},_onMenuShow:function(){if(!o)return;this.props.onMenuShow&&this.props.onMenuShow();},_onQueryFinished:function(q){q===this.state.query&&this.props.onQueryFinished();},_renderSearchInput:function(){if(!this.props.expanding)return null;return (j.createElement("div",{className:"_3f-7"},j.createElement(k,{onChange:this._onChange,onEntriesFound:this.props.onEntriesFound,onKeyDown:this.props.onKeyDown,placeholder:"Search",queryString:this.state.query,ref:"searchInput",searchSource:this.props.source,searchSourceOptions:{onQueryFinished:this._onQueryFinished}})));},_renderComposeLink:function(){return (j.createElement(i,{className:"_3a-4 _3a-5"}));},_renderDropdown:function(){if(o&&!this.props.expanding)return null;return (j.createElement(h,{className:"_43p4",isNormalSidebar:false,onClickPause:this.props.onClickPause,onHide:this._onMenuHide,onShow:this._onMenuShow,onToggleSidebar:this.props.onToggleSidebar}));},render:function(){return (j.createElement("div",{className:(("_iup")+(o?' '+"_1f7n":'')),ref:"search"},j.createElement("div",{"aria-label":"Search",className:"_35_4 _43p3","data-hover":"tooltip",onClick:this._onClickSearch,ref:"icon"}),this._renderSearchInput(),this._renderDropdown(),this._renderComposeLink()));}});e.exports=p;},null);
__d("ChatMiniSidebarSearchView.react",["ChatMiniSidebarThread.react","ChatMiniSidebarUser.react","ChatMiniSidebarUserMixin","ChatSidebarSections","ChatTypeaheadConstants","CurrentUser","MercuryIDs","PresenceStatus","React","MercuryThreadMetadataRawRenderer","XUISpinner.react","arrayContains","cx","fbt"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){var u=k.FRIEND_TYPE,v=k.THREAD_TYPE,w=k.FB4C_TYPE,x=k.PAGE_TYPE,y=k.NON_FRIEND_TYPE,z=o.createClass({displayName:"ChatMiniSidebarSearchView",mixins:[i],propTypes:{entries:o.PropTypes.arrayOf(o.PropTypes.object).isRequired,highlightID:o.PropTypes.string,onOpenTab:o.PropTypes.func,queryFinished:o.PropTypes.bool},_checkThread:function(aa){var ba='fbid:'+l.getID();if(!r(aa.participants,ba))return false;return true;},_renderThread:function(aa,ba){var ca=aa.getUniqueID(),da=aa.getAuxiliaryData();if(!da)return null;var ea=da.thread;if(!ea||!this._checkThread(ea))return null;var fa=da.participantsToRender,ga=ea.participants.length-1,ha=this._renderThreadName(ca,fa,ga),ia=n.getGroup(ea.participants.map(function(ja){return m.getUserIDFromParticipantID(ja);}));return (o.createElement(g,{context:ha,id:ca,isHighlighted:ca===this.props.highlightID,key:ca,threadName:ea.name,onOpenTab:this.props.onOpenTab,participants:da.participantsToRender,status:ia,thumbSrc:aa.getPhoto()}));},_renderThreadName:function(aa,ba,ca){return p.renderRawParticipantList(aa,ba,ca,{names_renderer:p.renderShortNames});},_renderUser:function(aa,ba){var ca=aa.getUniqueID();if(ca=='0')return null;var da=this.getStatus(ca),ea=aa.getType(),fa=ea===w||ea===y||ea===x?aa.getSubtitle():null;return (o.createElement(h,{context:fa,detailedStatus:da.detailedStatus,expanding:true,id:ca,isHighlighted:ca===this.props.highlightID,isOffline:da.offline,key:ca,name:aa.getTitle(),onOpenTab:this.props.onOpenTab,section:j.TYPEAHEAD,status:da.status,statusTime:da.statusTime,thumbSrc:aa.getPhoto()}));},_renderHeader:function(aa){return (o.createElement("div",{key:aa,className:"_5tmy"},o.createElement("div",{className:"_5tn8"},aa)));},_renderSection:function(aa,ba){var ca=this.props.entries.filter(function(ea){return ea.getType()===aa;}).reverse(),da=aa===v?this._renderThread:this._renderUser;return ca.length>0?[this._renderHeader(ba)].concat(ca.map(da)):[];},render:function(){var aa=null,ba="_9y8";if(this.props.entries.length===0){if(this.props.queryFinished){aa="No results.";}else{aa=o.createElement(q,null);ba="_9y8 _1rg3";}}else aa=this._renderSection(y,"MORE PEOPLE").concat(this._renderSection(x,"PAGES")).concat(this._renderSection(v,"GROUP CONVERSATIONS")).concat(this._renderSection(w,"CO-WORKERS")).concat(this._renderSection(u,"FRIENDS"));return (o.createElement("div",{className:ba},aa));}});e.exports=z;},null);
__d("ChatMiniSidebar.react",["AvailableList","AvailableListConstants","ChannelConnection","ChatOrderedList","ChatSidebarConstants","ChatSortUsers","ChatMiniSidebarBody.react","ChatMiniSidebarFooter.react","ChatMiniSidebarSearchView.react","ChatOpenTab","ChatSidebarSections","ChatTypeaheadConstants","Event","Keys","PresencePrivacy","React","SubscriptionsHandler","createObjectFrom","cx","emptyFunction","shield"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa){'use strict';var ba=6,ca=27,da=v.createClass({displayName:"ChatMiniSidebar",propTypes:{dataSource:v.PropTypes.object.isRequired,height:v.PropTypes.number.isRequired,maxEntries:v.PropTypes.number,onClickSearch:v.PropTypes.func.isRequired,onToggleSidebar:v.PropTypes.func,shown:v.PropTypes.bool},getDefaultProps:function(){return {maxEntries:0,onToggleSidebar:z,shown:false};},getInitialState:function(){return {currentQueryFinished:false,canExpand:true,canShrink:true,expanding:false,highlightIndex:0,inside:false,isSearching:false,pauseRendering:false,searchResults:[],users:[]};},componentWillMount:function(){this._subscriptions=new w();this._subscriptions.addSubscriptions(g.subscribe(h.ON_AVAILABILITY_CHANGED,this._updateUsers),i.subscribe([i.CONNECTED,i.RECONNECTING,i.SHUTDOWN,i.MUTE_WARNING,i.UNMUTE_WARNING],aa(this.forceUpdate,this)),u.subscribe('privacy-changed',aa(this.forceUpdate,this)),u.subscribe('privacy-user-presence-changed',this._updateUsers));this._updateUsers();},componentWillReceiveProps:function(ea){if(ea.shown!==this.props.shown)this.setState({currentQueryFinished:false,expanding:false,isSearching:false,searchResults:[]});},componentWillUnmount:function(){this._subscriptions&&this._subscriptions.release();},_getScrollableAreaHeight:function(){return Math.max(this.props.height-ba-ca,0);},_updateUsers:function(){if(!this.props.shown||this.state.pauseRendering)return;var ea=this._getScrollableAreaHeight(),fa=ea/k.getItemHeight(true),ga=j.getSortedList({},fa),ha=j.getAvailableList(x(ga));ha.sort(l.sortMobile);this.setState({users:ga.concat(ha)});},_onClickSearch:function(ea,fa){this.props.onClickSearch(ea);this.setState({currentQueryFinished:false,expanding:ea,isSearching:!!fa,highlightIndex:0});},_onEntriesFound:function(ea){this.setState({highlightIndex:0,searchResults:ea});},_onInputChanged:function(ea){var fa=!!ea;this.setState({currentQueryFinished:false,isSearching:fa});},_onClickPause:function(ea){this.setState({pauseRendering:ea});},_onMouseEnterSidebar:function(){this.setState({inside:true});clearTimeout(this._mouseLeaveCallback);clearTimeout(this._mouseOverCallback);},_onMenuHide:function(){!this.state.canShrink&&this.setState({canShrink:true});!this.state.inside&&this._onMouseLeaveSidebar();},_onMenuShow:function(){this.state.canShrink&&this.setState({canShrink:false});},_onMouseLeaveSidebar:function(){this.setState({inside:false});clearTimeout(this._mouseOverCallback);if(!this.state.expanding)return;clearTimeout(this._mouseLeaveCallback);this._mouseLeaveCallback=setTimeout(function(){(this.state.expanding&&this.state.canShrink)&&this._onClickSearch(false,'');}.bind(this),300);},_onMouseLeaveUser:function(){clearTimeout(this._mouseOverCallback);!this.state.canExpand&&this.setState({canExpand:true});},_onMouseOverUser:function(){clearTimeout(this._mouseLeaveCallback);if(this.state.expanding)return;clearTimeout(this._mouseOverCallback);this._mouseOverCallback=setTimeout(function(){(!this.state.expanding&&this.state.canExpand)&&this._onClickSearch(true,'');}.bind(this),500);},_onOpenTab:function(){this.setState({canExpand:false});this._onClickSearch(false,'');},_changeHighlight:function(ea){var fa=this.state.searchResults.length,ga=fa===0?0:(this.state.highlightIndex+ea)%fa;return ga>=0?ga:fa-1;},_onKeyDown:function(ea){var fa=s.getKeyCode(ea),ga=true;switch(fa){case t.UP:this.setState({highlightIndex:this._changeHighlight(1)});break;case t.DOWN:this.setState({highlightIndex:this._changeHighlight(-1)});break;case t.RETURN:var ha=this.state.searchResults[this.state.highlightIndex];if(ha){var ia=ha.getUniqueID(),ja=ha.getType()===r.THREAD_TYPE?p.openThread:p.openUserTab;ja(ia,q.TYPEAHEAD);this._onOpenTab();}break;default:ga=false;}ga&&ea.preventDefault();},_onQueryFinished:function(){this.setState({currentQueryFinished:true});},render:function(){if(!this.props.shown)return null;var ea=this._getScrollableAreaHeight(),fa=this.state.searchResults[this.state.highlightIndex],ga=fa?fa.getUniqueID():null,ha=this.state.isSearching?v.createElement(o,{entries:this.state.searchResults.slice(0,this.props.maxEntries),highlightID:ga,onOpenTab:this._onOpenTab,queryFinished:this.state.currentQueryFinished}):v.createElement(m,{className:"_269x",height:ea,expanding:this.state.expanding,onMouseLeave:this._onMouseLeaveUser,onMouseOver:this._onMouseOverUser,onScroll:function(){return clearTimeout(this._mouseOverCallback);}.bind(this),onOpenTab:this._onOpenTab,users:this.state.users});return (v.createElement("div",{className:"_269v",onMouseEnter:this._onMouseEnterSidebar,onMouseLeave:this._onMouseLeaveSidebar,style:{height:this.props.height}},v.createElement("div",{className:"_269w"}),ha,v.createElement(n,{expanding:this.state.expanding,onClickPause:this._onClickPause,onClickSearch:this._onClickSearch,onEntriesFound:this._onEntriesFound,onInputChanged:this._onInputChanged,onKeyDown:this._onKeyDown,onMenuHide:this._onMenuHide,onMenuShow:this._onMenuShow,onQueryFinished:this._onQueryFinished,onToggleSidebar:this.props.onToggleSidebar,source:this.props.dataSource})));}});e.exports=da;},null);
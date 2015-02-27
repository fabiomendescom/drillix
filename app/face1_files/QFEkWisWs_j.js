/*!CK:616180536!*//*1420430753,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["\/NrUp"]); }

__d("ChatSidebarDropdown.react",["Arbiter","AsyncRequest","ChatVisibility","ChatConfig","ChatOptions","ChatSidebarDropdownConstants","ChatTabActions","ContextualDialogArrow","ContextualLayerAutoFlip","Link.react","LogHistory","MenuSeparator.react","PopoverMenu.react","PresenceState","React","ReactXUIMenu","TrackingNodes","URI","cx","emptyFunction","fbt","ge","joinClasses"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ba,ca){'use strict';var da=v.Item,ea=v.SelectableItem,fa=v.SelectableMenu,ga=q.getInstance('blackbird'),ha=u.createClass({displayName:"ChatSidebarDropdown",propTypes:{className:u.PropTypes.string,isNormalSidebar:u.PropTypes.bool,onClickPause:u.PropTypes.func.isRequired,onHide:u.PropTypes.func,onShow:u.PropTypes.func,onToggleSidebar:u.PropTypes.func.isRequired},getDefaultProps:function(){return {className:'',isNormalSidebar:true,onHide:z,onShow:z};},getInitialState:function(){return {pendingChange:false};},_logVisibilityChange:function(ia,ja){var ka=ja?'sidebar_dropdown_visibility_error':'sidebar_dropdown_set_visibility';ga.debug(ka,{action:ia});},_changeSound:function(ia,ja){if(this.state.pendingChange)return;this.setState({pendingChange:true});var ka={};ka[ia]=!ja;k.setSetting(ia,!ja,'mini_sidebar_menu');new h('/ajax/chat/settings.php').setHandler(t.doSync).setErrorHandler(function(){return k.setSetting(ia,ja,'mini_sidebar_menu_error');}).setFinallyHandler(function(){return this.setState({pendingChange:false});}.bind(this)).setData(ka).setAllowCrossPageTransition(true).send();},_onClickOption:function(ia,ja){var ka=true;switch(ia){case l.SOUND:this._changeSound(ia,ja);break;case l.ADVANCED_SETTINGS:case l.TURN_OFF_DIALOG:g.inform('chat/advanced-settings-dialog-opened');this._logVisibilityChange(ia,false);break;case l.CLOSE_ALL_TABS:m.closeAllTabs();this._logVisibilityChange(ia,false);break;case l.SIDEBAR:this.props.onToggleSidebar();ka=false;break;case l.ONLINE:!i.isOnline()?i.goOnline():this._logVisibilityChange(ia,true);break;case l.PAUSE:this.props.onClickPause(!ja);break;case l.SHOW_APPS:case l.HIDE_APPS:case l.SHOW_TICKER:case l.HIDE_TICKER:break;}if(ka&&this.refs.menu)this.refs.menu.hidePopover();},_onItemClick:function(ia,ja){var ka=ja.item.getValue(),la=ja.item.isSelected&&ja.item.isSelected();this._onClickOption(ka,!!la);},_renderChatSoundOption:function(){return (u.createElement(ea,{value:l.SOUND,selected:k.getSetting(l.SOUND)},"Chat Sounds"));},_renderAdvancedSettingsOption:function(){return (u.createElement(da,{href:new x('/ajax/chat/privacy/settings_dialog.php'),rel:"dialog",value:l.ADVANCED_SETTINGS},"Advanced Settings..."));},_renderCloseAllOption:function(){return (u.createElement(da,{value:l.CLOSE_ALL_TABS},"Close All Chat Tabs"));},_renderHideSidebarOption:function(){return (u.createElement(da,{className:"_2xvi",value:l.SIDEBAR},"Hide Sidebar"));},_renderOnlineOption:function(){var ia=i.isOnline(),ja=ia?new x('/ajax/chat/privacy/turn_off_dialog.php'):'#',ka=ia?"Turn Off Chat":"Turn On Chat",la=ia?l.TURN_OFF_DIALOG:l.ONLINE;return (u.createElement(da,{href:ja,rel:ia?'dialog':'',value:la},ka));},_renderAppsOption:function(){if(!j.get('has_apps_option')||!this.props.isNormalSidebar)return null;var ia=j.get('has_games_slider'),ja=ia?"Hide Games":"Show Games",ka=ia?l.HIDE_APPS:l.SHOW_APPS;return (u.createElement(ea,{value:ka},ja));},_renderPauseOption:function(){if(!j.get('has_pause_render_option'))return null;return (u.createElement(ea,{value:l.PAUSE},"Pause Rendering"));},_renderTickerToggleOption:function(){if(!j.get('has_ticker_toggle_option')||!this.props.isNormalSidebar)return null;var ia=ba('pagelet_ticker'),ja=ia&&ia.offsetHeight!==0,ka=ja?"Hide Ticker":"Show Ticker",la=ja?l.HIDE_TICKER:l.SHOW_TICKER;return (u.createElement(ea,{value:la},ka));},_renderConditionalSeparator:function(ia){if(!ia)return null;return u.createElement(r,null);},_renderMenu:function(){return (u.createElement(fa,{className:'fbChatSidebarDropdown/PopoverMenu',multiple:true,onItemClick:this._onItemClick},this._renderChatSoundOption(),this._renderAdvancedSettingsOption(),this._renderConditionalSeparator(true),this._renderCloseAllOption(),this._renderHideSidebarOption(),this._renderOnlineOption(),this._renderConditionalSeparator(j.get('has_apps_option')&&this.props.isNormalSidebar),this._renderAppsOption(),this._renderConditionalSeparator(j.get('has_pause_render_option')||(j.get('has_ticker_toggle_option')&&this.props.isNormalSibar)),this._renderPauseOption(),this._renderTickerToggleOption()));},render:function(){var ia="Options",ja=ca(this.props.className,(("_5qth")+(' '+"_5vm9")+(!i.isOnline()?' '+"_5vma":''))),ka=w.getTrackingInfo(w.types.DROPDOWN_BUTTON);return (u.createElement(s,{alignh:"right",alignv:"top",className:ja,layerBehaviors:[o,n],menu:this._renderMenu(),onHide:this.props.onHide,onShow:this.props.onShow,ref:"menu"},u.createElement(p,{"aria-label":ia,className:"_5vmb button","data-ft":ka,"data-hover":"tooltip",href:"#"})));}});e.exports=ha;},null);
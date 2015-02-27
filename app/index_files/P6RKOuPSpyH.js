/*!CK:717231639!*//*1415670340,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["qTT6t"]); }

__d("ChatMiniSidebarUserMixin",["AvailableListConstants","ChannelConnection","LastMobileActiveTimes","PresencePrivacy","PresenceStatus"],function(a,b,c,d,e,f,g,h,i,j,k){'use strict';var l={getStatus:function(m){var n={offline:h.disconnected()||!j.allows(m),status:k.get(m)};if(n.status===g.ACTIVE)n.detailedStatus=k.getDetailedActivePresence(m);if(n.status===g.MOBILE)n.statusTime=i.getShortDisplay(m);return n;}};e.exports=l;},null);
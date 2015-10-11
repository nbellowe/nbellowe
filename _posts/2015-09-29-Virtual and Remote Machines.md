---
layout: post
title: Virtual Machines rock
tags: ["code", "programming", "language"]
---

#Why virtual machines are great.

I type this on my Macbook Pro (15", speedy), having just &#8984;+Tab-ed out of Visual Studio in a Windows 10 VM. I also have a Lubuntu VM I use regularly.

For my work, I'm forced into a Windows Development environment. (An ASP.NET server incompatible with Mono (at least I can't), most times I just need to change the static html/js files). Windows' lack of an ssh type feature makes controlling the Virtual Windows machines a lot harder.

I've tried lots of things to get around it:

 - Syncing `vm-code` `<->` `host-copy`. Building vm-code on the vm at change

 - Sharing `vm-code` `->` `host` and editing the code remotely at the host. Building vm-code on the vm at change.

In the end, the performance of VMWare Fusion 7 is great, and the `unity` mode, which makes each window in the Windows VM a seperate instance in OSX' window manager. This makes it easy to switch to a different application. However, I still don't like to type and interact with these windows any more than possible. However, just because I can open up VS, I don't; its too slow to use the IE integrated debugging and other features I'm used to.

I also have a linux vm that I can use for messing around inside of the kernel and be able to reset back to working state at will!

Of course, the uses of remote machines are limitless, and if you have access to a VPS, use it!

In the end, I have the ability to fire up in a single script all the browsers on all of the VMs.

&Oh no my markdown tables don't work& TODO
---------------------------------------------------
| OS | Chrome | Opera | Firefox | IE | Safari |
---------------------------------------------------
| Linux | X | X | X | | |
---------------------------------------------------
| Windows | X | X | X | X | |
---------------------------------------------------
| Max | X | X | X | | X |
---------------------------------------------------

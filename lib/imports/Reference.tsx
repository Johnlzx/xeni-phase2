import svgPaths from "./svg-10cicn7c3n";
const imgImageUserProfile = "/6583d01df7ada9696869b9565893d6c4c2134237.png";

function IconMore() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon - More">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - More">
          <path clipRule="evenodd" d={svgPaths.p35109ec0} fill="var(--fill-0, #5F6368)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function RightLockedIcons() {
  return (
    <div className="absolute content-stretch flex gap-[13px] items-center overflow-clip right-[14px] top-1/2 translate-y-[-50%]" data-name="Right Locked Icons">
      <div className="relative shrink-0 size-[22px]" data-name="Image - User Profile">
        <img alt="" className="block max-w-none size-full" height="22" src={imgImageUserProfile} width="22" />
      </div>
      <IconMore />
    </div>
  );
}

function IconFavorite() {
  return (
    <div className="absolute right-[10px] size-[16px] top-1/2 translate-y-[-50%]" data-name="Icon - Favorite">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - Favorite">
          <path clipRule="evenodd" d={svgPaths.p127de900} fill="var(--fill-0, #5F6368)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function Url() {
  return (
    <div className="absolute content-stretch flex items-center left-0 top-0" data-name="URL">
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#202124] text-[14px] text-nowrap tracking-[0.25px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">ginkgoo.legal</p>
      </div>
    </div>
  );
}

function UrlText() {
  return (
    <div className="absolute h-[16px] left-[33px] top-1/2 translate-y-[-50%] w-[165px]" data-name="URL Text">
      <Url />
    </div>
  );
}

function IconSecure() {
  return (
    <div className="absolute left-[11px] size-[12px] top-1/2 translate-y-[-50%]" data-name="Icon - Secure">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon - Secure">
          <path clipRule="evenodd" d={svgPaths.p2503ec80} fill="var(--fill-0, #5F6368)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function UrlBar() {
  return (
    <div className="absolute h-[28px] left-[134px] overflow-clip right-[83px] top-1/2 translate-y-[-50%]" data-name="URL Bar">
      <div className="absolute bg-[#f1f3f4] h-[28px] left-0 right-0 rounded-[14px] top-1/2 translate-y-[-50%]" data-name="URL Fill BG" />
      <IconFavorite />
      <UrlText />
      <IconSecure />
    </div>
  );
}

function IconHome() {
  return (
    <div className="absolute left-[calc(50%+46.5px)] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon - Home">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - Home">
          <path d={svgPaths.p30d8e900} fill="var(--fill-0, #5F6368)" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function IconRefresh() {
  return (
    <div className="absolute left-[calc(50%+15.5px)] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon - Refresh">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - Refresh">
          <path clipRule="evenodd" d={svgPaths.p6e12800} fill="var(--fill-0, #5F6368)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function IconForward() {
  return (
    <div className="absolute left-[calc(50%-15.5px)] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon - Forward">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - Forward">
          <path clipRule="evenodd" d={svgPaths.p245be700} fill="var(--fill-0, #BABCBE)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function IconBack() {
  return (
    <div className="absolute left-[calc(50%-46.5px)] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon - Back">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon - Back">
          <path clipRule="evenodd" d={svgPaths.p18d60780} fill="var(--fill-0, #5F6368)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function LeftLockedIcons() {
  return (
    <div className="absolute h-[16px] left-[12px] overflow-clip top-1/2 translate-y-[-50%] w-[109px]" data-name="Left Locked Icons">
      <IconHome />
      <IconRefresh />
      <IconForward />
      <IconBack />
    </div>
  );
}

function ToolbarUrlControls() {
  return (
    <div className="absolute h-[38px] left-0 overflow-clip right-px top-[42px]" data-name="Toolbar - URL Controls">
      <div className="absolute bg-white inset-0" data-name="URL Controls BG">
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1px_0px_0px_#dadce0]" />
      </div>
      <RightLockedIcons />
      <UrlBar />
      <LeftLockedIcons />
    </div>
  );
}

function Ginkgoo() {
  return (
    <div className="h-[16px] relative shrink-0 w-[17px]" data-name="Ginkgoo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 16">
        <g clipPath="url(#clip0_1_1783)" id="Ginkgoo 1">
          <path d={svgPaths.p30281c00} fill="var(--fill-0, #04489C)" id="Vector" />
          <path d={svgPaths.p7cc8f00} fill="var(--fill-0, #04489C)" id="Vector_2" />
          <path d={svgPaths.p2a7fa100} fill="var(--fill-0, #04489C)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_1_1783">
            <rect fill="white" height="16" width="17" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconClose() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon - Close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon - Close">
          <path clipRule="evenodd" d={svgPaths.p36a74680} fill="var(--fill-0, #3C4043)" fillRule="evenodd" id="Container" />
        </g>
      </svg>
    </div>
  );
}

function FaviconTextIcons() {
  return (
    <div className="bg-white content-stretch flex gap-[9px] items-center overflow-clip p-[8px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0" data-name="Favicon, Text, & Icons">
      <Ginkgoo />
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#494c4f] text-[12px] text-nowrap tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Ginkgoo</p>
      </div>
      <IconClose />
    </div>
  );
}

function TabContent() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Tab Content">
      <div className="h-[8px] relative shrink-0 w-[6px]" data-name="Curve L">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 8">
          <path clipRule="evenodd" d={svgPaths.p2ea0ec00} fill="var(--fill-0, white)" fillRule="evenodd" id="Curve L" />
        </svg>
      </div>
      <FaviconTextIcons />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[8px] relative w-[6px]" data-name="Curve R">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 8">
              <path clipRule="evenodd" d={svgPaths.p2ea0ec00} fill="var(--fill-0, white)" fillRule="evenodd" id="Curve R" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconPlus() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon - Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon - Plus">
          <path clipRule="evenodd" d={svgPaths.p2320e500} fill="var(--fill-0, #3C4043)" fillRule="evenodd" id="Icon - New Tab" />
        </g>
      </svg>
    </div>
  );
}

function Tab() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[-6px] top-0" data-name="Tab">
      <TabContent />
      <IconPlus />
    </div>
  );
}

function BrowserTabWithPlus() {
  return (
    <div className="absolute h-[34px] left-[8px] top-1/2 translate-y-[-50%] w-[131px]" data-name="Browser Tab / With Plus">
      <Tab />
    </div>
  );
}

function TabPlus() {
  return (
    <div className="absolute h-[34px] left-[72px] top-[calc(50%+4px)] translate-y-[-50%] w-[167px]" data-name="Tab & Plus">
      <BrowserTabWithPlus />
    </div>
  );
}

function BrowserControls() {
  return (
    <div className="absolute h-[12px] left-[13px] top-[calc(50%+0.5px)] translate-y-[-50%] w-[52px]" data-name="Browser Controls">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 12">
        <g clipPath="url(#clip0_1_1746)" id="Browser Controls">
          <circle cx="46" cy="6" fill="var(--fill-0, #27CA40)" id="Option - Expand" r="5.75" stroke="var(--stroke-0, #3EAF3F)" strokeWidth="0.5" />
          <circle cx="26" cy="6" fill="var(--fill-0, #FFC130)" id="Option - Minimize" r="5.75" stroke="var(--stroke-0, #E1A325)" strokeWidth="0.5" />
          <circle cx="6" cy="6" fill="var(--fill-0, #FF6058)" id="Option - Close" r="5.75" stroke="var(--stroke-0, #E14942)" strokeWidth="0.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_1746">
            <rect fill="white" height="12" width="52" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function BroswerControlBar() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Broswer Control Bar">
      <div className="absolute bg-[#dee1e6] inset-0 rounded-tl-[8px] rounded-tr-[8px]" data-name="Broswer Control Bar BG" />
      <TabPlus />
      <BrowserControls />
    </div>
  );
}

function ToolbarBrowserControls() {
  return (
    <div className="absolute inset-[0_0_47.5%_0]" data-name="Toolbar - Browser Controls">
      <BroswerControlBar />
    </div>
  );
}

function BrowserUrlControls() {
  return (
    <div className="h-[80px] overflow-clip relative shrink-0 w-full" data-name="Browser & URL Controls">
      <ToolbarUrlControls />
      <ToolbarBrowserControls />
    </div>
  );
}

function Ginkgoo1() {
  return (
    <div className="h-[22px] relative shrink-0 w-[23px]" data-name="Ginkgoo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
        <g clipPath="url(#clip0_1_1741)" id="Ginkgoo 1">
          <path d={svgPaths.p18965940} fill="var(--fill-0, #04489C)" id="Vector" />
          <path d={svgPaths.p2cb10700} fill="var(--fill-0, #04489C)" id="Vector_2" />
          <path d={svgPaths.p3d9b0f00} fill="var(--fill-0, #04489C)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_1_1741">
            <rect fill="white" height="22" width="23" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.5px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.5 12">
        <g id="Frame">
          <g clipPath="url(#clip0_1_1738)">
            <path d={svgPaths.p2dae2800} fill="var(--fill-0, #9CA3AF)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_1738">
            <path d="M0 0H7.5V12H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function StatusLabel() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Status Label">
      <p className="font-['Roboto:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#00a3ff] text-[12px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        In Progress
      </p>
    </div>
  );
}

function Lbl1BlueL() {
  return (
    <div className="bg-[#f1faff] content-stretch flex items-start px-[11.5px] py-[6px] relative rounded-[6px] shrink-0" data-name="Lbl 1 Blue L">
      <StatusLabel />
    </div>
  );
}

function Div() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[9px] items-center relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-[44px]">
        <p className="leading-[14px]">Cases</p>
      </div>
      <Frame />
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[257px]">
        <p className="leading-[14px]">Ahmed Hassan - Skilled Worker Visa</p>
      </div>
      <Lbl1BlueL />
    </div>
  );
}

function HeaderContent() {
  return (
    <div className="content-stretch flex gap-[15px] items-center relative shrink-0" data-name="Header Content">
      <Ginkgoo1 />
      <Div />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2d6860b0} fill="var(--fill-0, #52525B)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconsFlowChart() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icons/flow-chart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icons/flow-chart">
          <path d={svgPaths.p11a26e00} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="absolute bg-[#ef4444] border-0 border-[#e5e7eb] border-solid inset-[-45%_-42.5%_65%_62.5%] rounded-[9999px]" data-name="span">
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[17px] leading-[normal] left-[8.42px] not-italic text-[12px] text-center text-white top-[-1px] translate-x-[-50%] w-[8px]">5</p>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <div className="absolute inset-[8.33%_12.5%]" data-name="Icon">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(82, 82, 91, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.6667">
            <path d={svgPaths.p32afbc80} fill="var(--fill-0, #52525B)" id="Icon" />
          </svg>
        </div>
      </div>
      <Span />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex flex-col items-center justify-center relative rounded-[12px] shrink-0 size-[36px]" data-name="ButtonIcon">
      <div aria-hidden="true" className="absolute border-[#61a6fa] border-[3px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon1 />
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[24px] items-center justify-end relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <Icon />
      <IconsFlowChart />
      <ButtonIcon />
    </div>
  );
}

function Div2() {
  return (
    <div className="bg-[#e0f2fe] relative rounded-[9999px] shrink-0 size-[36px]" data-name="div">
      <div aria-hidden="true" className="absolute border border-[#bae6fd] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <p className="absolute font-['Poppins:Medium',sans-serif] h-[23px] leading-[normal] left-[8.64px] not-italic text-[#0369a1] text-[16px] top-[6px] w-[19px]">SJ</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Frame">
          <path d="M14 14H0V0H14V14Z" stroke="var(--stroke-0, #E5E7EB)" />
          <path d={svgPaths.p125446f2} fill="var(--fill-0, #9CA3AF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[14px]" data-name="Frame">
      <Frame1 />
    </div>
  );
}

function UserProfile() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="User Profile">
      <Div2 />
      <Frame2 />
    </div>
  );
}

function HeaderActions() {
  return (
    <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0" data-name="Header Actions">
      <Div1 />
      <div className="flex h-[19px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 1">
                <line id="Line 6" stroke="var(--stroke-0, #EFEFEF)" x2="19" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <UserProfile />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative w-full">
          <HeaderContent />
          <HeaderActions />
        </div>
      </div>
    </div>
  );
}

function IconLeaderboard() {
  return (
    <div className="absolute left-[5.1px] size-[14.172px] top-[5.22px]" data-name="Icon / Leaderboard">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1717 14.1717">
        <g clipPath="url(#clip0_1_1759)" id="Icon / Leaderboard">
          <g id="Vector"></g>
          <g id="Group">
            <path d={svgPaths.p33480600} fill="url(#paint0_linear_1_1759)" id="Vector_2" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1759" x1="7.08584" x2="7.08584" y1="1.77146" y2="12.4002">
            <stop stopColor="#967CFD" />
            <stop offset="1" stopColor="#3177FF" />
          </linearGradient>
          <clipPath id="clip0_1_1759">
            <rect fill="white" height="14.1717" width="14.1717" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0_0.8%_0.8%_0]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.8005 24.8005">
        <g id="Group 288897" opacity="0.2">
          <circle cx="12.4002" cy="12.4002" fill="url(#paint0_linear_1_1721)" id="Ellipse 35" r="12.4002" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1721" x1="-0.429074" x2="23.8994" y1="18.5666" y2="18.5666">
            <stop stopColor="#967CFD" />
            <stop offset="1" stopColor="#3177FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="overflow-clip relative shrink-0 size-[25px]">
      <IconLeaderboard />
      <Group />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">90%</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Completeness</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Frame18 />
          <Frame10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="relative shrink-0 size-[25.048px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.0483 25.0483">
        <g id="Group 288897">
          <circle cx="12.5242" cy="12.5242" fill="url(#paint0_linear_1_1711)" fillOpacity="0.15" id="Ellipse 35" r="12.5242" />
          <path d={svgPaths.p25c0bd00} fill="url(#paint1_linear_1_1711)" id="Path" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1711" x1="3.13104" x2="21.9173" y1="2.79937e-07" y2="25.0483">
            <stop stopColor="#FFBF1A" />
            <stop offset="1" stopColor="#FF4080" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_1711" x1="9.10848" x2="21.1148" y1="4.55541" y2="13.7031">
            <stop stopColor="#FFBF1A" />
            <stop offset="1" stopColor="#FF4080" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">5</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Issues</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group1 />
          <Frame13 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 288897">
          <g id="Ellipse 35">
            <circle cx="14" cy="14" fill="url(#paint0_linear_1_1751)" fillOpacity="0.25" r="14" />
            <circle cx="14" cy="14" r="14" stroke="url(#paint1_linear_1_1751)" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1751" x1="14" x2="14" y1="0" y2="28">
            <stop stopColor="#FFCE51" />
            <stop offset="1" stopColor="#FEE71C" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_1751" x1="14" x2="14" y1="0" y2="28">
            <stop stopColor="#FFCE51" />
            <stop offset="1" stopColor="#FEE71C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group2 />
    </div>
  );
}

function Group7() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group4 />
    </div>
  );
}

function Group8() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group7 />
    </div>
  );
}

function Group10() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group8 />
      <div className="[grid-area:1_/_1] h-[13.067px] ml-[6.6px] mt-[7.47px] relative w-[14.144px]" data-name="Vector">
        <div className="absolute inset-[-352.04%_-353.5%_-413.27%_-353.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.144 113.067">
            <g filter="url(#filter0_d_1_1701)" id="Vector">
              <path d={svgPaths.p173cc80} fill="url(#paint0_linear_1_1701)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="113.067" id="filter0_d_1_1701" width="114.144" x="-1.18323e-08" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.941176 0 0 0 0 0.952941 0 0 0 0 0.972549 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1701" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1701" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1701" x1="57.0721" x2="57.0721" y1="46" y2="59.0667">
                <stop stopColor="#FFAF51" />
                <stop offset="1" stopColor="#FFD914" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group10 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">8</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Reference</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group9 />
          <Frame15 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Group3() {
  return (
    <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group 288897">
          <circle cx="14" cy="14" fill="url(#paint0_linear_1_1780)" fillOpacity="0.15" id="Ellipse 35" r="14" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1780" x1="23.66" x2="4.06" y1="15.1666" y2="15.1666">
            <stop stopColor="#2FEA9B" />
            <stop offset="1" stopColor="#7FDD53" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Group3 />
    </div>
  );
}

function IconCheck() {
  return (
    <div className="[grid-area:1_/_1] h-[22.4px] ml-[2.47px] mt-[2.8px] relative w-[22.004px]" data-name="Icon / Check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.0042 22.4">
        <g id="Icon / Check">
          <path d={svgPaths.p7d41740} fill="url(#paint0_linear_1_1777)" id="icon/navigation/check_24px" stroke="url(#paint1_linear_1_1777)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1777" x1="16.3019" x2="5.5487" y1="11.689" y2="11.689">
            <stop stopColor="#2FEA9B" />
            <stop offset="1" stopColor="#7FDD53" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_1777" x1="16.3019" x2="5.5487" y1="11.689" y2="11.689">
            <stop stopColor="#2FEA9B" />
            <stop offset="1" stopColor="#7FDD53" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group5 />
      <IconCheck />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">5</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Missing information</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group6 />
          <Frame17 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="content-stretch flex gap-[24px] h-[86px] items-center relative shrink-0 w-full" data-name="Dashboard">
      <Frame9 />
      <Frame12 />
      <Frame16 />
      <Frame11 />
    </div>
  );
}

function PromptIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Prompt Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Prompt Icon">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function PromptContent() {
  return (
    <div className="content-stretch flex gap-[13px] items-start justify-end relative shrink-0 w-full" data-name="Prompt Content">
      <div className="basis-0 font-['Poppins:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#1b2559] text-[14px]">
        <p className="mb-0">{`The client's documentation is now on file. Proceed with a full analysis and establish a new case.`}</p>
        <p>Your initial brief should identify the visa route, verify document consistency, and flag any immediate points of concern against the prevailing Home Office requirements. Report back with your findings.</p>
      </div>
      <PromptIcon />
    </div>
  );
}

function Doc() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Doc">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Doc">
          <path d={svgPaths.pb263f80} fill="var(--fill-0, #E6F1FF)" id="Vector" />
          <path d={svgPaths.pf885ff0} fill="var(--fill-0, #96C6FF)" id="Vector_2" />
          <path d={svgPaths.p33219b00} fill="var(--fill-0, #0075FF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function FileName() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">File 1.doc</p>
      </div>
    </div>
  );
}

function FileItem() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0 w-[125px]" data-name="File Item">
      <Doc />
      <FileName />
    </div>
  );
}

function Pdf() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="PDF">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="PDF">
          <path d={svgPaths.p122fdf80} fill="var(--fill-0, #FFEEEF)" id="Vector" />
          <path d={svgPaths.p1e1dfc80} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
          <path d={svgPaths.p2fe64a00} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function FileName1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">
          <span className="font-['Poppins:Regular',sans-serif] not-italic">Passport</span>.doc
        </p>
      </div>
    </div>
  );
}

function FileItem1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf />
      <FileName1 />
    </div>
  );
}

function Doc1() {
  return (
    <div className="relative shrink-0 size-[22px]" data-name="Doc">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
        <g id="Doc">
          <path d={svgPaths.pb263f80} fill="var(--fill-0, #E6F1FF)" id="Vector" />
          <path d={svgPaths.pf885ff0} fill="var(--fill-0, #96C6FF)" id="Vector_2" />
          <path d={svgPaths.p33219b00} fill="var(--fill-0, #0075FF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function FileName2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">Birth Certificate.doc</p>
      </div>
    </div>
  );
}

function FileItem2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Doc1 />
      <FileName2 />
    </div>
  );
}

function FileList() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="File List">
      <FileItem />
      <FileItem1 />
      <FileItem2 />
    </div>
  );
}

function Prompt() {
  return (
    <div className="basis-0 bg-[#efefef] grow min-h-px min-w-px relative rounded-[18px] shrink-0" data-name="Prompt">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-start px-[24px] py-[18px] relative w-full">
          <PromptContent />
          <FileList />
        </div>
      </div>
    </div>
  );
}

function Prompt1() {
  return (
    <div className="content-stretch flex gap-[10px] items-start justify-end relative shrink-0 w-full" data-name="Prompt">
      <div className="bg-[#d9d9d9] h-[126px] opacity-0 shrink-0 w-[83px]" />
      <Prompt />
    </div>
  );
}

function IconBlackBlue() {
  return (
    <div className="h-[18px] relative shrink-0 w-[22px]" data-name="Icon_Black_Blue 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18">
        <g clipPath="url(#clip0_1_1689)" id="Icon_Black_Blue 1">
          <path d={svgPaths.p5b07500} fill="var(--fill-0, #1A1A1A)" id="Vector" />
          <path d={svgPaths.p34a5f8f0} fill="var(--fill-0, #05499C)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_1689">
            <rect fill="white" height="18" width="22" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconsArrowDownSLine() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/arrow-down-s-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icons/arrow-down-s-line" opacity="0">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Response() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Response">
      <IconBlackBlue />
      <IconsArrowDownSLine />
    </div>
  );
}

function IconL() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon L">
          <path clipRule="evenodd" d={svgPaths.p2b07baf0} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BadgeFill() {
  return (
    <div className="bg-[#e4570c] content-stretch flex gap-[6px] h-[28px] items-center justify-center min-h-[28px] overflow-clip px-[12px] py-0 relative rounded-[4px] shadow-[0px_0.5px_3px_0px_rgba(26,26,26,0.08)] shrink-0" data-name="BadgeFill">
      <IconL />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[14px] text-nowrap text-white">Conflicting</p>
    </div>
  );
}

function ResponseStatus() {
  return (
    <div className="content-stretch flex gap-[13px] items-center relative shrink-0" data-name="Response Status">
      <BadgeFill />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[#e4570c] text-[14px] text-nowrap">{`CONFLICT: Mismatch in 'Place of Birth'`}</p>
    </div>
  );
}

function ResponseIcon() {
  return (
    <div className="relative size-[24px]" data-name="Response Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Response Icon">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #E4570C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ResponseActions() {
  return (
    <div className="bg-[#fff4de] relative rounded-[6px] shrink-0 w-full" data-name="Response Actions">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between p-[8px] relative w-full">
          <ResponseStatus />
          <div className="flex items-center justify-center relative shrink-0 size-[24px]" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
            <div className="flex-none rotate-[270deg]">
              <ResponseIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Response1() {
  return (
    <div className="bg-white relative rounded-[18px] shrink-0 w-full" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-start px-[24px] py-[18px] relative w-full">
          <Response />
          <div className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
            <p className="mb-0">
              The application for Isabella Rossi is approximately<span className="font-['Poppins:Bold',sans-serif] not-italic">{` 80%`}</span>
              <span>{` complete and is currently on hold pending the submission of critical documentation.`}</span>
            </p>
            <p className="mb-0">{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed My initial analysis of the submitted documentation is complete. The findings have been synthesized into a structured summary to facilitate your review and decision-making.`}</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">1. Top-Line Case Overview</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">Applicant: [Applicant Name Placeholder]</p>
            <p className="mb-0">Case Readiness Score: Action Required [This is a dynamic field: e.g., Good Standing / Minor Action Required / Urgent Action Required]</p>
            <p className="mb-0">Summary: My analysis has identified [e.g., 1 Critical Issue] and [e.g., 2 Moderate Issues] that require your attention. The foundational evidence for this application appears strong, but the noted deficiencies must be addressed to ensure compliance.</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">{`2. Document & Data Integrity Check (Completeness)`}</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">This section evaluates the quality and completeness of the submitted file itself, before assessing the merits.</p>
            <p className="mb-0">Document Completeness: [e.g., 90% (9 out of 10 potentially required documents present)]. The file appears to be missing a potentially mandatory document.</p>
            <p className="mb-0">Data Consistency: High. All key data points (names, dates of birth, etc.) are consistent across the submitted documents, with one minor discrepancy noted in the employment history.</p>
            <p className="mb-0">{`Document Compliance: Generally Compliant. All submitted documents are legible, in English, and appear to be valid. One document's date range is slightly non-compliant.`}</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">{`3. Merits Assessment: Issues & Findings`}</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">I have categorized my findings by priority to help focus your review.</p>
            <p>{`Inconsistent Employment History: There is a conflict in the start date for the applicant's role at [Company Name]. The CV states [Date A], while the employment reference letter indicates [Date B]. This could raise questions about the applicant's credibility or the accuracy of the evidence. of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
          </div>
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1342 1">
                <line id="Line 10" stroke="var(--stroke-0, #E0E0E0)" x2="1342" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <ResponseActions />
        </div>
      </div>
    </div>
  );
}

function Ginkgoo2() {
  return (
    <div className="h-[22px] relative shrink-0 w-[23px]" data-name="Ginkgoo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
        <g clipPath="url(#clip0_1_1741)" id="Ginkgoo 1">
          <path d={svgPaths.p18965940} fill="var(--fill-0, #04489C)" id="Vector" />
          <path d={svgPaths.p2cb10700} fill="var(--fill-0, #04489C)" id="Vector_2" />
          <path d={svgPaths.p3d9b0f00} fill="var(--fill-0, #04489C)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_1_1741">
            <rect fill="white" height="22" width="23" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconsArrowDownSLine1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/arrow-down-s-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Prompt Icon">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Ginkgoo2 />
      <IconsArrowDownSLine1 />
    </div>
  );
}

function Response2() {
  return (
    <div className="bg-white opacity-0 relative rounded-[18px] shrink-0 w-full" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-start px-[24px] py-[18px] relative w-full">
          <Frame19 />
          <div className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
            <p className="mb-0">
              The application for Isabella Rossi is approximately<span className="font-['Poppins:Bold',sans-serif] not-italic">{` 80%`}</span>
              <span>{` complete and is currently on hold pending the submission of critical documentation.`}</span>
            </p>
            <p>{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed salary of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ginkgoo3() {
  return (
    <div className="h-[22px] relative shrink-0 w-[23px]" data-name="Ginkgoo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22">
        <g clipPath="url(#clip0_1_1741)" id="Ginkgoo 1">
          <path d={svgPaths.p18965940} fill="var(--fill-0, #04489C)" id="Vector" />
          <path d={svgPaths.p2cb10700} fill="var(--fill-0, #04489C)" id="Vector_2" />
          <path d={svgPaths.p3d9b0f00} fill="var(--fill-0, #04489C)" id="Vector_3" />
        </g>
        <defs>
          <clipPath id="clip0_1_1741">
            <rect fill="white" height="22" width="23" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconsArrowDownSLine2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/arrow-down-s-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icons/arrow-down-s-line" opacity="0">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Ginkgoo3 />
      <IconsArrowDownSLine2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Frame">
          <g clipPath="url(#clip0_1_1767)">
            <path d={svgPaths.pb25aa00} fill="var(--fill-0, #FFA800)" id="Vector" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_1767">
            <path d="M0 0H12V16H0V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-center justify-center left-0 top-0 w-[12px]" data-name="svg">
      <Frame3 />
    </div>
  );
}

function I() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] border-0 border-[#e5e7eb] border-solid h-[16px] left-[10px] top-[8px] w-[12px]" data-name="i">
      <Svg />
    </div>
  );
}

function Div3() {
  return (
    <div className="bg-[#fff4de] relative rounded-[9999px] shrink-0 size-[32px]" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <I />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[#4e4e4e] text-[16px]">
        <p className="leading-[12px] text-nowrap">On hold</p>
      </div>
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center relative shrink-0 text-[#2665ff] text-[14px]">
        <p className="leading-[normal] text-nowrap">{`June 16, 2025  12:12`}</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Div3 />
      <Frame7 />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="chevron-down$">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="chevron-down$">
          <path d={svgPaths.p324ca000} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame8 />
      <ChevronDown />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#e8fff3] content-stretch flex flex-col h-[6px] items-start relative rounded-[99px] shrink-0 w-full">
      <div className="bg-[#47be7d] h-[6px] rounded-[5px] shrink-0 w-[169px]" />
    </div>
  );
}

function IconL1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_1669)" id="Icon L">
          <g id="Icon">
            <path d={svgPaths.p16f11a80} fill="var(--fill-0, #52525B)" />
            <path d={svgPaths.p1c611b80} fill="var(--fill-0, #52525B)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_1669">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 bg-[#fcfcfc] grow h-[36px] min-h-[36px] min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center min-h-[inherit] px-[12px] py-0 relative size-full">
          <IconL1 />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
            <p className="leading-[22px]">Download</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconL2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon L">
          <path d={svgPaths.p2cf26d00} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 bg-[#fcfcfc] grow h-[36px] min-h-[36px] min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center min-h-[inherit] px-[12px] py-0 relative size-full">
          <IconL2 />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
            <p className="leading-[22px]">Continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <Button />
      <Button1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white relative rounded-[9px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[12px] py-[24px] relative w-full">
          <Frame6 />
          <Frame4 />
          <Frame14 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[9px]" />
    </div>
  );
}

function Response3() {
  return (
    <div className="bg-white opacity-0 relative rounded-[18px] shrink-0 w-full" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-start px-[24px] py-[18px] relative w-full">
          <Frame20 />
          <div className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
            <p className="mb-0">
              The application for Isabella Rossi is approximately<span className="font-['Poppins:Bold',sans-serif] not-italic">{` 80%`}</span>
              <span>{` complete and is currently on hold pending the submission of critical documentation.`}</span>
            </p>
            <p>{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed salary of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
          </div>
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function XeniLogo() {
  return (
    <div className="h-[22px] relative shrink-0 w-[20px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Logo">
          <path d="M19.1429 0H11.4286L5.71426 11L11.4286 22H19.1429L13.4286 11L19.1429 0Z" fill="#0E1B20" />
          <path d="M7.71429 0H0L5.71429 11L0 22H7.71429L13.4286 11L7.71429 0Z" fill="#0E1B20" />
        </g>
      </svg>
    </div>
  );
}

function ViewDocumentsChevron() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Chevron">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <path d="M7.5 5L12.5 10L7.5 15" stroke="#04489C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function SystemMessage() {
  return (
    <div className="bg-white relative rounded-[18px] shrink-0 w-full" data-name="System Message">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[24px] py-[18px] relative w-full">
          <XeniLogo />
          <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
            Your documentation has been consolidated and organized. Please review the updated set; the analysis workflow will commence once all files are finalized.
          </p>
          <div className="content-stretch flex items-center justify-end relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-center cursor-pointer">
              <span className="font-['Poppins:Medium',sans-serif] font-medium leading-[24px] not-italic text-[#04489C] text-[14px]">View documents</span>
              <ViewDocumentsChevron />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Conversation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[2168px] items-start left-0 overflow-x-clip overflow-y-auto right-[2px] top-0" data-name="Conversation">
      <Prompt1 />
      <Response1 />
      <SystemMessage />
      <Response2 />
      <Response3 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-1/2 size-[24px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.pd66f540} fill="var(--fill-0, #E4570C)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 size-[40px]" data-name="Icon">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0.5px_3px_0px_rgba(26,26,26,0.08)]" />
      <Icon2 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center p-[12px] relative w-full">
          <Icon3 />
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[#1a1a1a] text-[18px] w-[454px]">Discard unsaved changes?</p>
        </div>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-[12px] pt-0 px-[12px] relative w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[0px] text-[14px] text-[rgba(26,26,26,0.7)] w-full">
            <span>
              {`Install our Chrome browser extension to enable seamless automation. `}
              <br aria-hidden="true" />
              {`Already installed it? `}
            </span>
            <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid text-[#0e4268] underline">Refresh</span>
            <span>{` the page to get started.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function IconL3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_1646)" id="Icon L">
          <path d={svgPaths.p38cef900} fill="var(--fill-0, white)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_1646">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#0e4268] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(26,26,26,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL3 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[22px]">Install extension</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end p-[12px] relative w-full">
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function ModalDiscard() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="ModalDiscard">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <Frame22 />
        <Text />
        <div className="h-0 relative shrink-0 w-full">
          <div className="absolute inset-[-1px_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 566 1">
              <line id="Line 7" stroke="var(--stroke-0, #E1E1E2)" x2="566" y1="0.5" y2="0.5" />
            </svg>
          </div>
        </div>
        <Frame21 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1.5px_7px_0px_rgba(26,26,26,0.08)]" />
    </div>
  );
}

function IconL4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_1640)" id="Icon L">
          <path d={svgPaths.p10e25800} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_1640">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL4 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
        <p className="leading-[22px]">Upload documents</p>
      </div>
    </div>
  );
}

function IconL5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_1637)" id="Icon L">
          <path d={svgPaths.p10ad3240} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_1637">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL5 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
        <p className="leading-[22px]">Draft email</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[18px] items-center p-[16px] relative shrink-0">
      <Button3 />
      <Button4 />
    </div>
  );
}

function IconL6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_1_1772)" id="Icon L">
          <path d={svgPaths.p10ad3240} fill="var(--fill-0, white)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_1772">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#0e4268] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(26,26,26,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL6 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[22px]">Summarize</p>
      </div>
    </div>
  );
}

function IconL7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon L">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon L">
          <path d={svgPaths.p2cf26d00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#0e4268] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(26,26,26,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL7 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[18px] items-center p-[16px] relative shrink-0">
      <Button5 />
      <Button6 />
    </div>
  );
}

function ResponseCard() {
  return (
    <div className="bg-white h-[66px] relative rounded-[14px] shrink-0 w-full" data-name="Response Card">
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <Frame23 />
        <div className="flex h-[70px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
          <div className="flex-none rotate-[90deg]">
            <div className="h-0 relative w-[70px]">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 1">
                  <line id="Line 9" stroke="var(--stroke-0, #EBEBEB)" x2="70" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Frame24 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[14px_27px_45px_4px_rgba(112,144,176,0.2)]" />
    </div>
  );
}

function ActionBar() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col gap-[12px] items-center left-1/2 translate-x-[-50%]" data-name="Action bar">
      <ModalDiscard />
      <ResponseCard />
    </div>
  );
}

function MainConversation() {
  return (
    <div className="basis-0 grow min-h-px min-w-px overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-name="Main conversation">
      <Conversation />
      <ActionBar />
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="content">
    </div>
  );
}

function Frame25() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
      <div className="size-full">
        <div className="content-stretch flex items-start p-[24px] relative size-full">
          <Content />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="basis-0 bg-[#f2f3f7] content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-[1440px]" data-name="Main Content">
      <Header />
      <Frame25 />
    </div>
  );
}

export default function Reference() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Reference">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <BrowserUrlControls />
        <MainContent />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}
import svgPaths from "./svg-znjy2uzkhq";
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
        <p className="leading-[normal]">xeni.legal</p>
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

function Logo() {
  return (
    <div className="h-[13px] relative shrink-0 w-[12px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13">
        <g id="Logo">
          <path d={svgPaths.p2f37fe00} fill="var(--fill-0, #0E1B20)" id="Vector" />
        </g>
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
      <Logo />
      <div className="flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#494c4f] text-[12px] text-nowrap tracking-[0.2px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Xeni</p>
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

function Logo1() {
  return (
    <div className="h-[22px] relative shrink-0 w-[20px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Logo">
          <path d={svgPaths.p21bad480} fill="var(--fill-0, #0E1B20)" id="Vector" />
        </g>
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
      <Logo1 />
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

function ButtonIcon() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex flex-col items-center justify-center relative rounded-[12px] shrink-0 size-[36px]" data-name="ButtonIcon">
      <Icon />
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

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p31194300} fill="var(--fill-0, #52525B)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function Div1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[24px] items-center justify-end relative shrink-0" data-name="div">
      <div aria-hidden="true" className="absolute border-0 border-[#e5e7eb] border-solid inset-0 pointer-events-none" />
      <ButtonIcon />
      <IconsFlowChart />
      <Icon1 />
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
        <g clipPath="url(#clip0_6_4396)" id="Icon / Leaderboard">
          <g id="Vector"></g>
          <g id="Group">
            <path d={svgPaths.p33480600} fill="url(#paint0_linear_6_4396)" id="Vector_2" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_4396" x1="7.08584" x2="7.08584" y1="1.77146" y2="12.4002">
            <stop stopColor="#967CFD" />
            <stop offset="1" stopColor="#3177FF" />
          </linearGradient>
          <clipPath id="clip0_6_4396">
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
          <circle cx="12.4002" cy="12.4002" fill="url(#paint0_linear_6_4390)" id="Ellipse 35" r="12.4002" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_4390" x1="-0.429074" x2="23.8994" y1="18.5666" y2="18.5666">
            <stop stopColor="#967CFD" />
            <stop offset="1" stopColor="#3177FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="overflow-clip relative shrink-0 size-[25px]">
      <IconLeaderboard />
      <Group />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">90%</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Completeness</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Frame20 />
          <Frame12 />
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

function Frame15() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">5</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Issues</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group1 />
          <Frame15 />
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
            <circle cx="14" cy="14" fill="url(#paint0_linear_6_4414)" fillOpacity="0.25" r="14" />
            <circle cx="14" cy="14" r="14" stroke="url(#paint1_linear_6_4414)" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_4414" x1="14" x2="14" y1="0" y2="28">
            <stop stopColor="#FFCE51" />
            <stop offset="1" stopColor="#FEE71C" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_6_4414" x1="14" x2="14" y1="0" y2="28">
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
            <g filter="url(#filter0_d_6_4403)" id="Vector">
              <path d={svgPaths.p173cc80} fill="url(#paint0_linear_6_4403)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="113.067" id="filter0_d_6_4403" width="114.144" x="-1.18323e-08" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="25" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.941176 0 0 0 0 0.952941 0 0 0 0 0.972549 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_6_4403" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_6_4403" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_4403" x1="57.0721" x2="57.0721" y1="46" y2="59.0667">
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

function Frame17() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">8</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Reference</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group9 />
          <Frame17 />
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
          <path d={svgPaths.p7d41740} fill="url(#paint0_linear_6_4382)" id="icon/navigation/check_24px" stroke="url(#paint1_linear_6_4382)" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_4382" x1="16.3019" x2="5.5487" y1="11.689" y2="11.689">
            <stop stopColor="#2FEA9B" />
            <stop offset="1" stopColor="#7FDD53" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_6_4382" x1="16.3019" x2="5.5487" y1="11.689" y2="11.689">
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

function Frame19() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:SemiBold',sans-serif] gap-[4px] items-start justify-center leading-[1.215] not-italic relative shrink-0 text-nowrap">
      <p className="relative shrink-0 text-[24px] text-black">5</p>
      <p className="relative shrink-0 text-[#808080] text-[14px]">Missing information</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[21px] shrink-0">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[17px] py-[18px] relative w-full">
          <Group6 />
          <Frame19 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[21px]" />
    </div>
  );
}

function Dashboard() {
  return (
    <div className="content-stretch flex gap-[24px] h-[86px] items-center relative shrink-0 w-full" data-name="Dashboard">
      <Frame11 />
      <Frame14 />
      <Frame18 />
      <Frame13 />
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

function FileName() {
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

function FileItem() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf />
      <FileName />
    </div>
  );
}

function FileList() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="File List">
      <FileItem />
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

function Logo2() {
  return (
    <div className="h-[22px] relative shrink-0 w-[20px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Logo">
          <path d={svgPaths.p21bad480} fill="var(--fill-0, #0E1B20)" id="Vector" />
        </g>
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
      <Logo2 />
      <IconsArrowDownSLine />
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
            <p>{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed salary of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PromptIcon1() {
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

function PromptContent1() {
  return (
    <div className="content-stretch flex gap-[13px] items-start justify-end relative shrink-0 w-full" data-name="Prompt Content">
      <p className="basis-0 font-['Poppins:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#1b2559] text-[14px]">Additional supporting documents for review. Please incorporate these new files into the existing analysis and reassess the case strength.</p>
      <PromptIcon1 />
    </div>
  );
}

function Pdf1() {
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
        <p className="leading-[normal]">BankStatement_1.PDF</p>
      </div>
    </div>
  );
}

function FileItem1() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf1 />
      <FileName1 />
    </div>
  );
}

function Pdf2() {
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

function FileName2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">BankStatement_2.PDF</p>
      </div>
    </div>
  );
}

function FileItem2() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf2 />
      <FileName2 />
    </div>
  );
}

function Pdf3() {
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

function FileName3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">BankStatement_3.PDF</p>
      </div>
    </div>
  );
}

function FileItem3() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf3 />
      <FileName3 />
    </div>
  );
}

function Pdf4() {
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

function FileName4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">BankStatement_4.PDF</p>
      </div>
    </div>
  );
}

function FileItem4() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf4 />
      <FileName4 />
    </div>
  );
}

function Pdf5() {
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

function FileName5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">BankStatement_5.PDF</p>
      </div>
    </div>
  );
}

function FileItem5() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf5 />
      <FileName5 />
    </div>
  );
}

function Pdf6() {
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

function FileName6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">BankStatement_6.PDF</p>
      </div>
    </div>
  );
}

function FileItem6() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf6 />
      <FileName6 />
    </div>
  );
}

function FileList1() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="File List">
      <FileItem1 />
      <FileItem2 />
      <FileItem3 />
      <FileItem4 />
      <FileItem5 />
      <FileItem6 />
    </div>
  );
}

function Pdf7() {
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

function FileName7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">UtilityBill_1.PDF</p>
      </div>
    </div>
  );
}

function FileItem7() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf7 />
      <FileName7 />
    </div>
  );
}

function Pdf8() {
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

function FileName8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">UtilityBill_2.PDF</p>
      </div>
    </div>
  );
}

function FileItem8() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf8 />
      <FileName8 />
    </div>
  );
}

function Pdf9() {
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

function FileName9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">UtilityBill_3.PDF</p>
      </div>
    </div>
  );
}

function FileItem9() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf9 />
      <FileName9 />
    </div>
  );
}

function Pdf10() {
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

function FileName10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">UtilityBill_4.PDF</p>
      </div>
    </div>
  );
}

function FileItem10() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf10 />
      <FileName10 />
    </div>
  );
}

function Pdf11() {
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

function FileName11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="File Name">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] text-nowrap">
        <p className="leading-[normal]">
          <span className="font-['Poppins:Regular',sans-serif] not-italic">Unkown.</span>PDF
        </p>
      </div>
    </div>
  );
}

function FileItem11() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center pl-[12px] pr-[24px] py-[12px] relative rounded-[12px] shrink-0" data-name="File Item">
      <Pdf11 />
      <FileName11 />
    </div>
  );
}

function FileList2() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full" data-name="File List">
      <FileItem7 />
      <FileItem8 />
      <FileItem9 />
      <FileItem10 />
      <FileItem11 />
    </div>
  );
}

function Prompt2() {
  return (
    <div className="basis-0 bg-[#efefef] grow min-h-px min-w-px relative rounded-[18px] shrink-0" data-name="Prompt">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-start px-[24px] py-[18px] relative w-full">
          <PromptContent1 />
          <FileList1 />
          <FileList2 />
        </div>
      </div>
    </div>
  );
}

function Prompt3() {
  return (
    <div className="content-stretch flex gap-[10px] items-start justify-end relative shrink-0 w-full" data-name="Prompt">
      <div className="bg-[#d9d9d9] h-[126px] opacity-0 shrink-0 w-[83px]" />
      <Prompt2 />
    </div>
  );
}

function Logo3() {
  return (
    <div className="h-[22px] relative shrink-0 w-[20px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
        <g id="Logo">
          <path d={svgPaths.p21bad480} fill="var(--fill-0, #0E1B20)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconsArrowDownSLine1() {
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

function Response2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Response">
      <Logo3 />
      <IconsArrowDownSLine1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p3ec8f700} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[4px] px-[4px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#fef3c6] h-[19px] relative rounded-[4px] shrink-0 w-[47.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[6px] py-[2px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#bb4d00] text-[10px] text-nowrap tracking-[0.3672px] uppercase">Draft</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-[199.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1d293d] text-[16px] text-nowrap tracking-[-0.3125px]">Bank Statement.pdf</p>
        <Text />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Container />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#62748e] text-[10px] tracking-[0.6172px] uppercase w-[241px]">2 pages • Waiting for confirmation</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-[231.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative w-full">
        <Button />
        <Container1 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M9.33333 11.3333H3.33333" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 4.66667H6.66667" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 bg-[#0e4369] grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-0 relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Merge</p>
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-[96.648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(255,251,235,0.5)] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#fee685] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[14px] relative w-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p3ec8f700} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[4px] px-[4px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#fef3c6] h-[19px] relative rounded-[4px] shrink-0 w-[47.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[6px] py-[2px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#bb4d00] text-[10px] text-nowrap tracking-[0.3672px] uppercase">Draft</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-[199.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative w-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1d293d] text-[16px] text-nowrap tracking-[-0.3125px]">Utility Bill</p>
        <Text1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative w-full">
        <Container6 />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#62748e] text-[10px] tracking-[0.6172px] uppercase w-[241px]">2 pages • Waiting for confirmation</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-[231.102px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative w-full">
        <Button3 />
        <Container7 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M9.33333 11.3333H3.33333" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 4.66667H6.66667" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 bg-[#0e4369] grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-0 relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Merge</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-[96.648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Button4 />
        <Button5 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[rgba(255,251,235,0.5)] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#fee685] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[14px] relative w-full">
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Response3() {
  return (
    <div className="bg-white relative rounded-[18px] shrink-0 w-full" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col gap-[13px] items-end px-[24px] py-[18px] relative w-full">
          <Response2 />
          <p className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">Related files detected. These files have been grouped based on similarity. Should they be merged into a single document?</p>
          <Container5 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function Ginkgoo() {
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
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Prompt Icon">
          <path d={svgPaths.p1cebd600} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Ginkgoo />
      <IconsArrowDownSLine2 />
    </div>
  );
}

function Response4() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[13px] items-start opacity-0 px-[24px] py-[18px] relative rounded-[18px] shrink-0 w-[688px]" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <Frame21 />
      <div className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
        <p className="mb-0">
          The application for Isabella Rossi is approximately<span className="font-['Poppins:Bold',sans-serif] not-italic">{` 80%`}</span>
          <span>{` complete and is currently on hold pending the submission of critical documentation.`}</span>
        </p>
        <p>{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed salary of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
      </div>
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

function IconsArrowDownSLine3() {
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

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Ginkgoo1 />
      <IconsArrowDownSLine3 />
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

function Frame8() {
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

function Frame9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Div3 />
      <Frame8 />
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

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame9 />
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

function IconL() {
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

function Button6() {
  return (
    <div className="basis-0 bg-[#fcfcfc] grow h-[36px] min-h-[36px] min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center min-h-[inherit] px-[12px] py-0 relative size-full">
          <IconL />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
            <p className="leading-[22px]">Download</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconL1() {
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

function Button7() {
  return (
    <div className="basis-0 bg-[#fcfcfc] grow h-[36px] min-h-[36px] min-w-px relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center justify-center min-h-[inherit] px-[12px] py-0 relative size-full">
          <IconL1 />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
            <p className="leading-[22px]">Continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white relative rounded-[9px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start px-[12px] py-[24px] relative w-full">
          <Frame7 />
          <Frame4 />
          <Frame16 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[9px]" />
    </div>
  );
}

function Response5() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[13px] items-start opacity-0 px-[24px] py-[18px] relative rounded-[18px] shrink-0 w-[688px]" data-name="Response">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[18px]" />
      <Frame22 />
      <div className="font-['Poppins:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#1b2559] text-[14px] w-full">
        <p className="mb-0">
          The application for Isabella Rossi is approximately<span className="font-['Poppins:Bold',sans-serif] not-italic">{` 80%`}</span>
          <span>{` complete and is currently on hold pending the submission of critical documentation.`}</span>
        </p>
        <p>{`The AI-driven analysis confirms that the applicant's Certificate of Sponsorship (CoS), identity, English language ability, and educational qualifications meet the visa requirements. The proposed salary of £42,500 for SOC Code 2136 is compliant with the rules.`}</p>
      </div>
      <Frame6 />
    </div>
  );
}

function Conversation() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[2168px] items-start left-0 overflow-x-clip overflow-y-auto top-0 w-[986px]" data-name="Conversation">
      <Prompt1 />
      <Response1 />
      <Prompt3 />
      <Response3 />
      <Response4 />
      <Response5 />
    </div>
  );
}

function IconL2() {
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

function Button8() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL2 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-center text-nowrap">
        <p className="leading-[22px]">Add reference</p>
      </div>
    </div>
  );
}

function IconL3() {
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

function Button9() {
  return (
    <div className="bg-[#0e4268] content-stretch flex gap-[4px] h-[36px] items-center justify-center min-h-[36px] px-[12px] py-0 relative rounded-[12px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(26,26,26,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <IconL3 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-nowrap text-white">
        <p className="leading-[22px]">Start auto-fill</p>
      </div>
    </div>
  );
}

function ActionBar() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex gap-[12px] items-start justify-center left-1/2 p-[16px] rounded-[12px] translate-x-[-50%]" data-name="Action bar">
      <div aria-hidden="true" className="absolute border border-[#e1e1e2] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Button8 />
      <Button9 />
    </div>
  );
}

function MainConversation() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Main conversation">
      <Conversation />
      <ActionBar />
    </div>
  );
}

function ConversationSection() {
  return (
    <div className="basis-0 content-stretch flex grow items-start justify-end min-h-px min-w-px relative shrink-0 w-full" data-name="Conversation Section">
      <MainConversation />
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[24px] grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="content">
      <Dashboard />
      <ConversationSection />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 6.66667V10.6667" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 8.66667H10" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f315b00} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <Icon6 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[217.5px]">
      <div className="flex flex-col font-['Poppins:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[16px] text-nowrap">
        <p className="leading-[14px]">Reference</p>
      </div>
      <Button10 />
    </div>
  );
}

function IconsCloseLine() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icons/close-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icons/close-line">
          <path d={svgPaths.p160c5800} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame30 />
      <IconsCloseLine />
    </div>
  );
}

function Pdf12() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="PDF">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="PDF">
          <path d={svgPaths.p22e28900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
          <path d={svgPaths.p3703b040} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
          <path d={svgPaths.p30d24280} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[#1f2937] text-[0px]">
        <p className="leading-[normal] text-[14px] text-nowrap">
          <span className="font-['Poppins:Regular',sans-serif] not-italic">Passport</span>.pdf
        </p>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[14px]">4 MB</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic relative shrink-0 text-nowrap">
      <Frame33 />
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] relative shrink-0 text-[#b4b3b3] text-[12px]">
        <p className="leading-[normal] text-nowrap">Uploaded 2 days ago</p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Pdf12 />
      <Frame24 />
    </div>
  );
}

function DotsVertical() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="dots-vertical$">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="dots-vertical$" opacity="0">
          <g id="Icon">
            <path d={svgPaths.p283f2100} fill="var(--fill-0, #52525B)" />
            <path d={svgPaths.p10787b00} fill="var(--fill-0, #52525B)" />
            <path d={svgPaths.p3da0900} fill="var(--fill-0, #52525B)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[43px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-0 relative size-full">
          <Frame25 />
          <DotsVertical />
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#1f2937] text-[14px] w-[257px]">
        <p className="leading-[14px]">Passport</p>
      </div>
      <Frame5 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(225, 225, 226, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 344 1">
            <line id="Line 8" stroke="var(--stroke-0, #E1E1E2)" x2="344" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p3ec8f700} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[4px] px-[4px] relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#fef3c6] h-[19px] relative rounded-[4px] shrink-0 w-[47.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[6px] py-[2px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#bb4d00] text-[10px] text-nowrap tracking-[0.3672px] uppercase">Draft</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1d293d] text-[16px] text-nowrap tracking-[-0.3125px]">Bank Statement</p>
        <Text2 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
        <Container12 />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#62748e] text-[10px] text-nowrap tracking-[0.6172px] uppercase">Waiting for confirmation</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative">
        <Button11 />
        <Container13 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M9.33333 11.3333H3.33333" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 4.66667H6.66667" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div className="basis-0 bg-[#0e4369] grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-0 relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Merge</p>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-[96.648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Button12 />
        <Button13 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-[rgba(255,251,235,0.5)] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#fee685] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[14px] relative w-full">
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 9.33333">
            <path d={svgPaths.p3ec8f700} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[4px] px-[4px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#fef3c6] h-[19px] relative rounded-[4px] shrink-0 w-[47.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[6px] py-[2px] relative size-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic relative shrink-0 text-[#bb4d00] text-[10px] text-nowrap tracking-[0.3672px] uppercase">Draft</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#1d293d] text-[16px] text-nowrap tracking-[-0.3125px]">Utility Bill</p>
        <Text3 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
        <Container18 />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[15px] not-italic relative shrink-0 text-[#62748e] text-[10px] text-nowrap tracking-[0.6172px] uppercase">Waiting for confirmation</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative">
        <Button14 />
        <Container19 />
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M9.33333 11.3333H3.33333" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 4.66667H6.66667" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div className="basis-0 bg-[#0e4369] grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-0 relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-nowrap text-white">Merge</p>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-[96.648px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative w-full">
        <Button15 />
        <Button16 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[4px] items-center not-italic relative shrink-0 text-nowrap">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#1f2937] text-[14px]">UtilityBill_1.PDF</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[12px]">4 MB</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] text-nowrap top-px">Just now</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[53px] top-[7px]" data-name="Container">
      <Frame31 />
      <Paragraph />
    </div>
  );
}

function Pdf13() {
  return (
    <div className="absolute contents inset-[0_5.7%_0_5.65%]" data-name="PDF">
      <div className="absolute inset-[3.5%_9.2%_3.5%_9.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1281 29.76">
          <path d={svgPaths.p15620900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_5.7%_0_5.65%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3681 32">
          <path d={svgPaths.pd4b2e00} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[26.4%_24.51%_22.6%_24.5%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3159 16.32">
          <path d={svgPaths.pd20e980} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </svg>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Pdf13 />
    </div>
  );
}

function PdfIcon() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9px] size-[32px] top-[9px]" data-name="PdfIcon">
      <Icon11 />
    </div>
  );
}

function FileItem12() {
  return (
    <div className="bg-white h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="FileItem">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container23 />
      <PdfIcon />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[4px] items-center not-italic relative shrink-0 text-nowrap">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#1f2937] text-[14px]">UtilityBill_2.PDF</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[12px]">4 MB</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] text-nowrap top-px">Just now</p>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[53px] top-[7px]" data-name="Container">
      <Frame32 />
      <Paragraph1 />
    </div>
  );
}

function Pdf14() {
  return (
    <div className="absolute contents inset-[0_5.7%_0_5.65%]" data-name="PDF">
      <div className="absolute inset-[3.5%_9.2%_3.5%_9.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1281 29.76">
          <path d={svgPaths.p15620900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_5.7%_0_5.65%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3681 32">
          <path d={svgPaths.pd4b2e00} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[26.4%_24.51%_22.6%_24.5%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3159 16.32">
          <path d={svgPaths.pd20e980} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </svg>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Pdf14 />
    </div>
  );
}

function PdfIcon1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9px] size-[32px] top-[9px]" data-name="PdfIcon">
      <Icon12 />
    </div>
  );
}

function FileItem13() {
  return (
    <div className="bg-white h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="FileItem">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container24 />
      <PdfIcon1 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[4px] items-center not-italic relative shrink-0 text-nowrap">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#1f2937] text-[14px]">UtilityBill_3.PDF</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[12px]">4 MB</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] text-nowrap top-px">Just now</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[53px] top-[7px]" data-name="Container">
      <Frame34 />
      <Paragraph2 />
    </div>
  );
}

function Pdf15() {
  return (
    <div className="absolute contents inset-[0_5.7%_0_5.65%]" data-name="PDF">
      <div className="absolute inset-[3.5%_9.2%_3.5%_9.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1281 29.76">
          <path d={svgPaths.p15620900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_5.7%_0_5.65%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3681 32">
          <path d={svgPaths.pd4b2e00} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[26.4%_24.51%_22.6%_24.5%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3159 16.32">
          <path d={svgPaths.pd20e980} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </svg>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Pdf15 />
    </div>
  );
}

function PdfIcon2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9px] size-[32px] top-[9px]" data-name="PdfIcon">
      <Icon13 />
    </div>
  );
}

function FileItem14() {
  return (
    <div className="bg-white h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="FileItem">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container25 />
      <PdfIcon2 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[4px] items-center not-italic relative shrink-0 text-nowrap">
      <p className="font-['Poppins:Regular',sans-serif] leading-[normal] relative shrink-0 text-[#1f2937] text-[14px]">UtilityBill_4.PDF</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[12px]">4 MB</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] text-nowrap top-px">Just now</p>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[53px] top-[7px]" data-name="Container">
      <Frame35 />
      <Paragraph3 />
    </div>
  );
}

function Pdf16() {
  return (
    <div className="absolute contents inset-[0_5.7%_0_5.65%]" data-name="PDF">
      <div className="absolute inset-[3.5%_9.2%_3.5%_9.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1281 29.76">
          <path d={svgPaths.p15620900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_5.7%_0_5.65%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3681 32">
          <path d={svgPaths.pd4b2e00} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[26.4%_24.51%_22.6%_24.5%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3159 16.32">
          <path d={svgPaths.pd20e980} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </svg>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Pdf16 />
    </div>
  );
}

function PdfIcon3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[9px] size-[32px] top-[9px]" data-name="PdfIcon">
      <Icon14 />
    </div>
  );
}

function FileItem15() {
  return (
    <div className="bg-white h-[50px] relative rounded-[10px] shrink-0 w-full" data-name="FileItem">
      <div aria-hidden="true" className="absolute border border-[#f1f5f9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container26 />
      <PdfIcon3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <FileItem12 />
      <FileItem13 />
      <FileItem14 />
      <FileItem15 />
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[rgba(255,251,235,0.5)] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-2 border-[#fee685] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[14px] relative w-full">
          <Container22 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p16fbdc80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.15%_37.83%_45.83%_37.87%]" data-name="Vector">
        <div className="absolute inset-[-16.65%_-17.15%_-16.66%_-17.16%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.91514 4.00237">
            <path d={svgPaths.p16777a80} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-1/2 right-[49.96%] top-[70.83%]" data-name="Vector">
        <div className="absolute inset-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.005 1">
            <path d="M0.5 0.5H0.505" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-[#e2e8f0] relative rounded-[4px] shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-0 pt-[4px] px-[4px] relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-[93.313px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#314158] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px]">Unclassified</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[24px] relative shrink-0 w-[150px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container29 />
        <Heading />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[150px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[12.5px] left-0 not-italic text-[#62748e] text-[10px] top-[0.5px] tracking-[0.1172px] w-[135px]">AI could not identify these 1 files. Review required.</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[53px] relative shrink-0 w-[150px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container30 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M9.33333 11.3333H3.33333" id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 4.66667H6.66667" id="Vector_2" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2badb400} id="Vector_3" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p79fe00} id="Vector_4" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button17() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex h-[53px] items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Button17 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#45556c] text-[14px] text-nowrap top-[0.5px] tracking-[-0.1504px]">Unkown.pdf</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#62748e] text-[12px] text-nowrap top-px">Just now</p>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute content-stretch flex flex-col h-[36px] items-start left-[53px] top-[7px] w-[267.75px]" data-name="Container">
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Pdf17() {
  return (
    <div className="absolute contents inset-[0_5.7%_0_5.65%]" data-name="PDF">
      <div className="absolute inset-[3.5%_9.2%_3.5%_9.15%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.1281 29.76">
          <path d={svgPaths.p15620900} fill="var(--fill-0, #FFEEEF)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0_5.7%_0_5.65%]" data-name="Vector_2">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.3681 32">
          <path d={svgPaths.pd4b2e00} fill="var(--fill-0, #FFB8BE)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[26.4%_24.51%_22.6%_24.5%]" data-name="Vector_3">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3159 16.32">
          <path d={svgPaths.pd20e980} fill="var(--fill-0, #FF5462)" id="Vector_3" />
        </svg>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Pdf17 />
    </div>
  );
}

function PdfIcon4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[32px] top-0" data-name="PdfIcon">
      <Icon17 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
            <path d={svgPaths.p7206a80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-1/2 right-1/2 top-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.33333 4">
            <path d="M0.666667 0.666667V3.33333" id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[33.33%] left-1/2 right-[49.96%] top-[66.67%]" data-name="Vector">
        <div className="absolute inset-[-0.67px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.34 1.33333">
            <path d="M0.666667 0.666667H0.673334" id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-[20px] rounded-[1.67772e+07px] size-[16px] top-[-4px]" data-name="Container">
      <Icon18 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute left-[9px] size-[32px] top-[9px]" data-name="Container">
      <PdfIcon4 />
      <Container34 />
    </div>
  );
}

function FileItem16() {
  return (
    <div className="bg-[#f1f5f9] h-[50px] opacity-80 relative rounded-[10px] shrink-0 w-full" data-name="FileItem">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container33 />
      <Container35 />
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[rgba(248,250,252,0.8)] h-[141px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start pb-px pt-[13px] px-[13px] relative size-full">
          <Container32 />
          <FileItem16 />
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[712px] items-start relative shrink-0 w-full" data-name="Container">
      <Frame29 />
      <Container17 />
      <Container28 />
      <Container36 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame10 />
      <Container37 />
    </div>
  );
}

function IconsFileCopyLine() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icons/file-copy-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icons/file-copy-line">
          <path d={svgPaths.p1f5afe00} fill="var(--fill-0, #52525B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#1a1a1a] text-[14px] text-nowrap">manis+case001@msg.xeni.legal</p>
      <IconsFileCopyLine />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(26,26,26,0.7)] w-full">
        <p className="leading-[normal]">{`Forward a client's email thread to the address below. Our AI will analyze the contents, extract key information, and create a new case file automatically.`}</p>
      </div>
      <Frame26 />
    </div>
  );
}

function ResponseCard() {
  return (
    <div className="bg-white content-stretch flex flex-col h-full items-start justify-between px-[19px] py-[22px] relative rounded-[14px] shrink-0 w-[382px]" data-name="Response Card">
      <div aria-hidden="true" className="absolute border border-[#e2e4e8] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Frame28 />
      <Frame27 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full">
      <div className="size-full">
        <div className="content-stretch flex gap-[24px] items-start p-[24px] relative size-full">
          <Content />
          <ResponseCard />
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="basis-0 bg-[#f2f3f7] content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0 w-[1440px]" data-name="Main Content">
      <Header />
      <Frame23 />
    </div>
  );
}

export default function ReferencePannelOpen() {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Reference pannel open">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <BrowserUrlControls />
        <MainContent />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}
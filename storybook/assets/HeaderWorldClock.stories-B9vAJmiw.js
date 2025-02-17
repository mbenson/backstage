import{R as r}from"./index-CTjT7uj6.js";import{HeaderWorldClock as s}from"./index-B3YqHXgz.js";import{H as d}from"./Header-soBKJiBl.js";import{w as u}from"./appWrappers-BdmV716_.js";import"./HeaderLabel-LJr81fe1.js";import"./makeStyles-Dm18XSEu.js";import"./defaultTheme-DXWIybXe.js";import"./Grid-Ddd13ysM.js";import"./capitalize-DIeCfh_E.js";import"./withStyles-DXZDjQMO.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./Typography-cLPqD11X.js";import"./Link-V5mBMZDY.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-QA7F3UF1.js";import"./index-BkN7i-fW.js";import"./ApiRef-BSBwTmJJ.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-CdyNcF9g.js";import"./useControlled-CogIeAPD.js";import"./createSvgIcon-BJFLD5ph.js";import"./isMuiElement-Cb6QZSLO.js";import"./unstable_useId-B3Hiq1YI.js";import"./useAnalytics-DTrkS1Gy.js";import"./ConfigApi-DBUUc3nU.js";import"./Helmet-DPVyO7__.js";import"./index-BRV0Se7Z.js";import"./Box-ByXAoPiX.js";import"./typography-DWsaOnmo.js";import"./Breadcrumbs-C-XUxjbE.js";import"./react-is.production.min-D0tnNtx9.js";import"./ButtonBase-CWOryP-z.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./Popover-CdkpxSRS.js";import"./Modal-c6Oz2q5s.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-DHXjgkAG.js";import"./Paper-qJ_yTBwO.js";import"./Grow-Brjbh0kw.js";import"./useTheme-DSe7I3Kh.js";import"./utils-BS_pqTfZ.js";import"./List-CwINgjy8.js";import"./ListContext-DydK1sOh.js";import"./ListItem-Bu8awMTM.js";import"./Page-DDAxalP_.js";import"./useMediaQuery-C6ETadO1.js";import"./Tooltip-q1efGeM_.js";import"./Popper-C5oFUnaT.js";import"./MockTranslationApi-o7x4waXj.js";import"./index-CFaqwFgm.js";import"./inherits-CKtKJvtL.js";import"./toArray-pI9XEa5R.js";import"./TranslationApi-eOxINumg.js";import"./WebStorage-D5Fgivzj.js";import"./useAsync-CXA3qup_.js";import"./useMountedState-DkESzBh4.js";import"./componentData-CM4hSmEF.js";import"./isSymbol-C_KZXW2d.js";import"./isObject-DlTwUI3n.js";import"./toString-B79bsZRM.js";import"./ApiProvider-CuNQiN7Z.js";import"./CssBaseline-CCCms-mx.js";import"./ThemeProvider-f7E7OGWC.js";import"./jsx-runtime-Cw0GR0a5.js";import"./palettes-B20oCNII.js";const Eo={title:"Plugins/Home/Components/HeaderWorldClock",decorators:[o=>u(r.createElement(o,null))]},e=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!0};return r.createElement(d,{title:"Header World Clock",pageTitleOverride:"Home"},r.createElement(s,{clockConfigs:o,customTimeFormat:i}))},t=()=>{const o=[{label:"NYC",timeZone:"America/New_York"},{label:"UTC",timeZone:"UTC"},{label:"STO",timeZone:"Europe/Stockholm"},{label:"TYO",timeZone:"Asia/Tokyo"}],i={hour:"2-digit",minute:"2-digit",hour12:!1};return r.createElement(d,{title:"24hr Header World Clock",pageTitleOverride:"Home"},r.createElement(s,{clockConfigs:o,customTimeFormat:i}))};e.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"TwentyFourHourClocks"};var m,a,l;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const clockConfigs: ClockConfig[] = [{
    label: 'NYC',
    timeZone: 'America/New_York'
  }, {
    label: 'UTC',
    timeZone: 'UTC'
  }, {
    label: 'STO',
    timeZone: 'Europe/Stockholm'
  }, {
    label: 'TYO',
    timeZone: 'Asia/Tokyo'
  }];
  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return <Header title="Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock clockConfigs={clockConfigs} customTimeFormat={timeFormat} />
    </Header>;
}`,...(l=(a=e.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};var p,c,n;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const clockConfigs: ClockConfig[] = [{
    label: 'NYC',
    timeZone: 'America/New_York'
  }, {
    label: 'UTC',
    timeZone: 'UTC'
  }, {
    label: 'STO',
    timeZone: 'Europe/Stockholm'
  }, {
    label: 'TYO',
    timeZone: 'Asia/Tokyo'
  }];
  const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return <Header title="24hr Header World Clock" pageTitleOverride="Home">
      <HeaderWorldClock clockConfigs={clockConfigs} customTimeFormat={timeFormat} />
    </Header>;
}`,...(n=(c=t.parameters)==null?void 0:c.docs)==null?void 0:n.source}}};const No=["Default","TwentyFourHourClocks"];export{e as Default,t as TwentyFourHourClocks,No as __namedExportsOrder,Eo as default};

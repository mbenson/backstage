import{i as k}from"./interopRequireDefault-Y9pwbXtE.js";import{r as L,i as H}from"./createSvgIcon-CdyNcF9g.js";import{r as C,R as e}from"./index-CTjT7uj6.js";import{d as w}from"./Group-B_g5QCzp.js";import{H as r}from"./DefaultResultListItem-DIzu8eIV.js";import{M as B}from"./index-BkN7i-fW.js";import{S as c}from"./Grid-Ddd13ysM.js";import{L as P}from"./LinkButton-CZOpgiPi.js";import{l as u}from"./themes-DvRsTggF.js";import{T as b}from"./ThemeProvider-f7E7OGWC.js";import{C as q}from"./CssBaseline-CCCms-mx.js";import"./capitalize-DIeCfh_E.js";import"./defaultTheme-DXWIybXe.js";import"./withStyles-DXZDjQMO.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./useControlled-CogIeAPD.js";import"./index-QA7F3UF1.js";import"./createSvgIcon-BJFLD5ph.js";import"./isMuiElement-Cb6QZSLO.js";import"./unstable_useId-B3Hiq1YI.js";import"./ListItemIcon-CUJfJGXg.js";import"./ListContext-DydK1sOh.js";import"./ListItemText-C1R0jMcl.js";import"./Typography-cLPqD11X.js";import"./makeStyles-Dm18XSEu.js";import"./Box-ByXAoPiX.js";import"./typography-DWsaOnmo.js";import"./useAnalytics-DTrkS1Gy.js";import"./ApiRef-BSBwTmJJ.js";import"./ConfigApi-DBUUc3nU.js";import"./Link-V5mBMZDY.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./Button-DIC9OkW8.js";import"./ButtonBase-CWOryP-z.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./palettes-B20oCNII.js";var m={},A=k,M=H;Object.defineProperty(m,"__esModule",{value:!0});var D=m.default=void 0,N=M(C),z=A(L()),F=(0,z.default)(N.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");D=m.default=F;const ye={title:"Plugins/Search/DefaultResultListItem",component:r,decorators:[l=>e.createElement(B,null,e.createElement(c,{container:!0,direction:"row"},e.createElement(c,{item:!0,xs:12},e.createElement(l,null))))]},t={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},o=()=>e.createElement(r,{result:t}),a=()=>e.createElement(r,{result:t,icon:e.createElement(D,{color:"primary"})}),s=()=>e.createElement(r,{result:t,secondaryAction:e.createElement(P,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.createElement(w,null),style:{textTransform:"lowercase"}},t.owner)}),i=()=>e.createElement(r,{result:t,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),n=()=>{const l={...u,overrides:{...u.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.createElement(b,{theme:l},e.createElement(q,null,e.createElement(r,{result:t,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})))};o.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};s.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};i.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};n.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};var h,d,p;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...(p=(d=o.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var g,f,R;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...(R=(f=a.parameters)==null?void 0:f.docs)==null?void 0:R.source}}};var x,I,S;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} secondaryAction={<LinkButton to="#" size="small" aria-label="owner" variant="text" startIcon={<GroupIcon />} style={{
    textTransform: 'lowercase'
  }}>
          {mockSearchResult.owner}
        </LinkButton>} />;
}`,...(S=(I=s.parameters)==null?void 0:I.docs)==null?void 0:S.source}}};var T,_,v;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} highlight={{
    preTag: '<tag>',
    postTag: '</tag>',
    fields: {
      text: 'some <tag>text</tag> from the search result'
    }
  }} />;
}`,...(v=(_=i.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};var E,y,W;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`() => {
  const customTheme = {
    ...lightTheme,
    overrides: {
      ...lightTheme.overrides,
      BackstageHighlightedSearchResultText: {
        highlight: {
          color: 'inherit',
          backgroundColor: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'underline'
        }
      }
    }
  };
  return <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <DefaultResultListItem result={mockSearchResult} highlight={{
        preTag: '<tag>',
        postTag: '</tag>',
        fields: {
          text: 'some <tag>text</tag> from the search result'
        }
      }} />
      </CssBaseline>
    </ThemeProvider>;
}`,...(W=(y=n.parameters)==null?void 0:y.docs)==null?void 0:W.source}}};const We=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{o as Default,n as WithCustomHighlightedResults,i as WithHighlightedResults,a as WithIcon,s as WithSecondaryAction,We as __namedExportsOrder,ye as default};

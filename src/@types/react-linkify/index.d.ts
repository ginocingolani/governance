declare module 'react-linkify' {
  import * as React from "react";

  export interface Match {
    index: number;
    lastIndex: number;
    text: string;
    url: string;
  }

  export interface LinkifyProps {
    children: React.ReactNode;
    componentDecorator?: (
      decoratedHref: string,
      decoratedText: string,
      key: number
    ) => React.ReactNode;
    hrefDecorator?: (text: string) => string;
    matchDecorator?: (text: string) => Match[];
    textDecorator?: (text: string) => string;
  }

  export default class Linkify extends React.Component<LinkifyProps, {}> { }
}

declare module 'react-linkify/dist/decorators/defaultMatchDecorator' {
  import { Match } from 'linkify-it';
  export default function (text: string): Array<Match>
}
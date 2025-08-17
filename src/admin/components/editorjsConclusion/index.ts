/**
 * Import types
 */
import type {
  API,
  ToolboxConfig,
  BlockTool,
  ToolConfig,
  BlockToolData,
  BlockToolConstructorOptions
} from '@editorjs/editorjs';

/**
 * Import Tool's icon
 */
const IconNote = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
<text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="currentColor">C</text>
</svg>`

/**
 * Blog Conclusion Tool's CSS classnames
 */
interface ConclusionCSS {
  baseClass: string;
  wrapper: string;
  title: string;
  input: string;
  message: string;
}

/**
 * Blog Conclusion Tool's input and output data
 */
interface ConclusionData extends BlockToolData {
  /**
   * Conclusion's title
   */
  title: string;
  /**
   * Conclusion's main message
   */
  message: string;
}

/**
 * Blog Conclusion Tool's initial configuration
 */
interface ConclusionConfig extends ToolConfig {
  /**
   * Placeholder to show in conclusion's title input
   */
  titlePlaceholder?: string;
  /**
   * Placeholder to show in conclusion's message input
   */
  messagePlaceholder?: string;
}

/**
 * Blog Conclusion Tool's constructor arguments
 */
interface ConclusionConstructorArgs {
  /**
   * Previously saved conclusion's data
   */
  data: ConclusionData;
  /**
   * Blog Conclusion Tool's configuration
   */
  config?: ConclusionConfig;
  /**
   * Editor.js API instance
   */
  api: API;
  /**
   * Read-only mode
   */
  readOnly: boolean;
}

/**
 * @class BlogConclusion
 * @classdesc Blog Conclusion Tool for Editor.js
 */
export default class BlogConclusion implements BlockTool {
  /**
   * Editor.js API instance
   */
  private api: API;
  /**
   * Blog Conclusion Tool's input and output data
   */
  private data: ConclusionData;
  /**
   * Read-only mode is supported
   */
  private readOnly: boolean;
  /**
   * Placeholder for the title input
   */
  private titlePlaceholder: string;
  /**
   * Placeholder for the message input
   */
  private messagePlaceholder: string;

  /**
   * Notify core that read-only mode is supported
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Get Toolbox settings
   */
  static get toolbox(): ToolboxConfig {
    return {
      icon: IconNote,
      title: 'Blog Conclusion',
    };
  }

  /**
   * Allow to press Enter inside the Conclusion
   */
  static get enableLineBreaks(): boolean {
    return true;
  }

  /**
   * Default placeholders
   */
  static get DEFAULT_TITLE_PLACEHOLDER(): string {
    return 'Conclusion Headline';
  }

  static get DEFAULT_MESSAGE_PLACEHOLDER(): string {
    return 'Summarize your key takeaways and final thoughts...';
  }

  /**
   * Blog Conclusion Tool's styles
   */
  get CSS(): ConclusionCSS {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-blog-conclusion',
      title: 'cdx-blog-conclusion__title',
      input: this.api.styles.input,
      message: 'cdx-blog-conclusion__message',
    };
  }

  /**
   * Constructor
   */
  constructor({ data, config, api, readOnly }: BlockToolConstructorOptions) {
    this.api = api;
    this.readOnly = readOnly;

    this.titlePlaceholder =
      config?.titlePlaceholder || BlogConclusion.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder =
      config?.messagePlaceholder || BlogConclusion.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || '',
      message: data.message || '',
    };
  }

  /**
   * Create Blog Conclusion Tool container with inputs
   */
  render(): HTMLElement {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const title = this._make('div', [this.CSS.input, this.CSS.title], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.title,
    });
    const message = this._make('div', [this.CSS.input, this.CSS.message], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.message,
    });

    title.dataset.placeholder = this.titlePlaceholder;
    message.dataset.placeholder = this.messagePlaceholder;

    container.appendChild(title);
    container.appendChild(message);

    return container;
  }

  /**
   * Extract Blog Conclusion data from the element
   */
  save(conclusionElement: HTMLDivElement): ConclusionData {
    const title = conclusionElement.querySelector(`.${this.CSS.title}`);
    const message = conclusionElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      title: title?.innerHTML ?? '',
      message: message?.innerHTML ?? '',
    });
  }

  /**
   * Helper for making Elements with attributes
   */
  private _make<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    classNames: string | string[] | null = null,
    attributes: { [key: string]: any } = {}
  ): HTMLElementTagNameMap[K] {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      (el as any)[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Blog Conclusion Tool saved data
   */
  static get sanitize() {
    return {
      title: {},
      message: {},
    };
  }
}
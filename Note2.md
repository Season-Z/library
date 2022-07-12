```json
{
  "files": ["dist", "lib", "es"],
  "sideEffects": ["dist/*", "es/**/style/*", "lib/**/style/*", "*.less"],
  "main": "lib/index.js",
  "module": "es/index.js",
  "unpkg": "dist/antd.min.js",
  "typings": "lib/index.d.ts",
  "browserslist": ["last 2 versions", "Firefox ESR", "> 1%", "ie >= 11"],
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  }
}
```

--

```javascript
export interface UploadProps<T = any> {
  type?: UploadType;
  name?: string;
  defaultFileList?: Array<UploadFile<T>>;
  fileList?: Array<UploadFile<T>>;
  action?:
    | string
    | ((file: RcFile) => string)
    | ((file: RcFile) => PromiseLike<string>);
  directory?: boolean;
  data?: object | ((file: UploadFile<T>) => object);
  method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
  headers?: HttpRequestHeader;
  showUploadList?: boolean | ShowUploadListInterface;
  multiple?: boolean;
  accept?: string;
  beforeUpload?: (
    file: RcFile,
    FileList: RcFile[],
  ) => boolean | PromiseLike<void>;
  onChange?: (info: UploadChangeParam) => void;
  listType?: UploadListType;
  className?: string;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
  supportServerRender?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  prefixCls?: string;
  customRequest?: (options: RcCustomRequestOptions) => void;
  withCredentials?: boolean;
  openFileDialogOnClick?: boolean;
  locale?: UploadLocale;
  id?: string;
  previewFile?: PreviewFileHandler;
  transformFile?: TransformFileHandler;
  iconRender?: (
    file: UploadFile<T>,
    listType?: UploadListType,
  ) => React.ReactNode;
  isImageUrl?: (file: UploadFile) => boolean;
  progress?: UploadListProgressProps;
}
```

```javascript
// Requiring function causes error during builds
// as the code tries to reference window
const module = require('module'); // Error

// Wrap the require in check for window
if (typeof window !== `undefined`) {
  const module = require('module');
}
```

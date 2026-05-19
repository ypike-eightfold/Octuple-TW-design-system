# Upload

Upload component for file upload functionality with drag-and-drop support.

## Import

```typescript
import { Upload } from '@eightfold.ai/octuple';
import type { UploadFile, OcFile } from '@eightfold.ai/octuple';
```

## API Reference

### Upload Props

| Property | Description | Type | Default | Version |
|----------|-------------|------|---------|---------|
| accept | File types that can be accepted. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | `string` | | |
| acceptedFileTypesText | The accepted files string | `string` | `'(doc, docx, pdf or txt)'` | |
| action | The Upload URL | `Action` | | |
| beforeUpload | Hook executed before uploading. Uploading will be stopped with false or a rejected Promise returned. When returned value is Upload.LIST_IGNORE, the list of files that have been uploaded will ignore it. **Warning: Not supported in IE9 and below** | `(file: OcFile, FileList: OcFile[]) => BeforeUploadValueType \| Promise<BeforeUploadValueType>` | `null` | |
| classNames | The Upload component class names | `string` | | |
| configContextProps | Configure how contextual props are consumed | `ConfigContextProps` | `{ noDisabledContext: false }` | |
| customRequest | Override for the default xhr behavior allowing for additional customization and ability to implement your own XMLHttpRequest. Provide your own XMLHttpRequest calls to interface with custom backend processes or interact with AWS S3 service through the aws-sdk-js package | `(options: UploadRequestOption) => void` | `null` | |
| data | Upload extra params or function which can return uploading extra params | `Record<string, unknown> \| ((file: UploadFile<T>) => Record<string, unknown> \| Promise<Record<string, unknown>>)` | | |
| defaultFileList | Default list of files that have been uploaded | `Array<UploadFile<T>>` | | |
| directory | Upload a directory. See [caniuse](https://caniuse.com/input-file-directory) | `boolean` | `false` | |
| disabled | Disables the Upload button | `boolean` | `false` | |
| downloadFileText | The download file string | `string` | `'Download file'` | |
| dragAndDropFileText | The drag and drop string | `string` | `'Drag & drop file'` | |
| dragAndDropMultipleFilesText | The multiple drag and drop string | `string` | `'Drag & drop files'` | |
| fileList | List of files that have been uploaded (controlled). Update fileList in the uploading cycle. If it's not updated, the uploading cycle won't trigger the done cycle | `Array<UploadFile<T>>` | | |
| fullWidth | Assigns Upload 100% width | `boolean` | `false` | >= 2.47.0 |
| headers | Set request headers. **Warning: Not supported in IE9 and below** | `HttpRequestHeader` | | |
| iconRender | The custom icon | `(file: UploadFile<T>, listType?: UploadListType) => React.ReactNode` | | |
| id | The Upload component id | `string` | | |
| isImageUrl | Customize if render `<img />` is in the thumbnail | `(file: UploadFile) => boolean` | | |
| itemRender | Custom Upload list item | `ItemRender<T>` | | |
| listType | Built-in styles. Supports three types: 'text', 'picture' or 'picture-card' | `<'text' \| 'picture' \| 'picture-card'>UploadListType` | `'text'` | |
| locale | The Upload component locale | `UploadLocale` | | |
| maxCount | Limit the number of uploaded files. Will replace current one when `maxCount` is 1 | `number` | | |
| method | The http method of the upload request | `UploadRequestMethod` | `'post'` | |
| multiple | Whether to support multiple file upload. Enables select multiple files using CTRL button when true. **Warning: Not supported in IE9 and below** | `boolean` | `false` | |
| name | The name of uploading file | `string` | `'file'` | |
| onChange | Callback executed when uploading state is changing | `(info: UploadChangeParam<UploadFile<T>>) => void` | | |
| onDownload | Download file method | `(file: UploadFile<T>) => void` | `jump to new TAB` | |
| onDrop | Callback executed when files are dragged and dropped into the Upload area | `(event: React.DragEvent<HTMLDivElement>) => void` | | |
| onPreview | Callback executed when file link or preview icon is clicked | `(file: UploadFile<T>) => void` | | |
| onRemove | Callback executed when remove button is clicked. Remove event will be prevented when return value is false or a Promise is resolve(false) or rejected | `(file: UploadFile<T>) => void \| boolean \| Promise<void \| boolean>` | | |
| onReplace | Callback executed when replace button is clicked. Replace event will be prevented when return value is false or a Promise is resolve(false) or rejected | `(file: UploadFile<T>) => void \| boolean \| Promise<void \| boolean>` | | |
| openFileDialogOnClick | Click to open file dialog. Useful for drop only upload as it does not trigger on enter key or click event | `boolean` | `true` | |
| previewFile | Customize the preview file logic | `PreviewFileHandler` | | |
| previewFileText | The preview file string | `string` | `'Preview file'` | |
| progress | Custom progress bar | `UploadListProgressProps` | `{ strokeWidth: 2, showLabels: false }` | |
| removeFileText | The remove file string | `string` | `'Remove file'` | |
| replaceFileText | The replace string | `string` | `'Replace'` | |
| selectFileText | The select file string | `string` | `'Select file'` | |
| selectMultipleFilesText | The select multiple files string | `string` | `'Select files'` | |
| showUploadList | Whether to show default upload list, could be an object to specify each `showPreviewIconButton`, `showRemoveIconButton`, `showDownloadIconButton`, `removeIcon`, `replaceIcon`, and `downloadIcon` | `boolean \| ShowUploadListInterface` | `true` | |
| size | The Upload size | `<enum>UploadSize` | `UploadSize.Medium` | |
| style | The Upload component custom styles | `React.CSSProperties` | | |
| type | The Upload type | `UploadType` | `'select'` | |
| uploadErrorText | The file upload failed string | `string` | `'File upload failed'` | |
| uploadingText | The uploading string | `string` | `'Uploading'` | |
| withCredentials | AJAX upload with cookie | `boolean` | `false` | |

### UploadFile Type

| Property | Description | Type |
|----------|-------------|------|
| crossOrigin | CORS settings attributes | `React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin']` |
| error | The Upload file error message | `any` |
| fileName | The Upload file name | `string` |
| lastModified | The Upload file last modified date in milliseconds | `number` |
| lastModifiedDate | The Upload file last modified date | `Date` |
| linkProps | The Upload file link props | `any` |
| name | The Upload file name or the path | `string` |
| originFileObj | The Upload file object | `OcFile` |
| percent | The Upload file progress percent | `number` |
| preview | The Upload file preview url | `string` |
| response | The Upload file response | `T` |
| size | The Upload file size | `number` |
| status | The Upload file status | `UploadFileStatus` |
| thumbUrl | The Upload file thumb url | `string` |
| type | The Upload file type | `string` |
| uid | The file unique identifier | `string` |
| url | The Upload file url | `string` |
| xhr | The Upload file xhr header | `T` |

### OcFile (extends File)

| Property | Description | Type |
|----------|-------------|------|
| lastModifiedDate | The Upload file last modified date | `Date` |
| uid | The file unique identifier | `string` |

## TypeScript Enums

```typescript
enum UploadSize {
  Flex = 'flex',
  Large = 'large',
  Medium = 'medium',
  Small = 'small'
}

enum UploadType {
  Select = 'select',
  Drag = 'drag'
}

enum UploadListType {
  Text = 'text',
  Picture = 'picture',
  PictureCard = 'picture-card'
}
```

## Usage Examples

### Basic Upload

```typescript
import { Upload, Button } from '@eightfold.ai/octuple';
import type { UploadFile } from '@eightfold.ai/octuple';

function DocumentUpload() {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  const handleChange = (info: any) => {
    setFileList(info.fileList);
  };

  return (
    <Upload
      action="https://api.example.com/upload"
      fileList={fileList}
      onChange={handleChange}
    />
  );
}
```

### Drag and Drop Upload

```typescript
import { Upload } from '@eightfold.ai/octuple';

function DragDropUpload() {
  const [files, setFiles] = React.useState([]);

  return (
    <Upload
      type="drag"
      multiple
      fileList={files}
      onChange={(info) => setFiles(info.fileList)}
      accept=".pdf,.doc,.docx"
    >
      <p>Drag & drop files here or click to browse</p>
    </Upload>
  );
}
```

### Image Upload with Preview

```typescript
import { Upload } from '@eightfold.ai/octuple';
import type { UploadFile } from '@eightfold.ai/octuple';

function ImageGallery() {
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || file.preview || '');
    setPreviewVisible(true);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={(info) => setFileList(info.fileList)}
        accept="image/*"
        maxCount={5}
      />
      {previewVisible && (
        <Modal
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
        >
          <img src={previewImage} alt="preview" style={{ width: '100%' }} />
        </Modal>
      )}
    </>
  );
}
```

### Upload with beforeUpload Validation

```typescript
import { Upload } from '@eightfold.ai/octuple';
import type { OcFile } from '@eightfold.ai/octuple';

function ValidatedUpload() {
  const beforeUpload = (file: OcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      console.error('You can only upload JPG/PNG files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      console.error('Image must be smaller than 2MB!');
      return false;
    }
    
    return true;
  };

  return (
    <Upload
      beforeUpload={beforeUpload}
      accept="image/jpeg,image/png"
    />
  );
}
```

### Custom Upload Request (AWS S3)

```typescript
import { Upload } from '@eightfold.ai/octuple';
import AWS from 'aws-sdk';

function S3Upload() {
  const customRequest = async ({ file, onProgress, onSuccess, onError }: any) => {
    const s3 = new AWS.S3({
      accessKeyId: 'YOUR_ACCESS_KEY',
      secretAccessKey: 'YOUR_SECRET_KEY'
    });

    const params = {
      Bucket: 'your-bucket',
      Key: file.name,
      Body: file
    };

    try {
      const upload = s3.upload(params);
      
      upload.on('httpUploadProgress', (evt) => {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress({ percent });
      });

      const result = await upload.promise();
      onSuccess(result, file);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Upload customRequest={customRequest} />
  );
}
```

## Accessibility

- Provide clear labels and instructions for what files to upload
- Use `accept` prop to restrict file types
- Show upload progress for better feedback
- Handle error states gracefully with clear messages
- Ensure keyboard access to upload trigger

## Best Practices

1. **Validate Files**: Use `beforeUpload` to validate file type, size, and format
2. **Show Progress**: Display upload progress for better UX
3. **Limit File Types**: Use `accept` prop to guide users
4. **Handle Errors**: Provide clear error messages for failed uploads
5. **Control File List**: Use controlled `fileList` for better state management
6. **Set Max Count**: Use `maxCount` to limit number of files
7. **Provide Feedback**: Use `onChange` to track upload status

## Common Mistakes

❌ **Don't** allow unlimited file sizes

```typescript
// Bad - no size validation
<Upload action="/upload" />
```

✅ **Do** validate file size

```typescript
// Good
<Upload
  beforeUpload={(file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      console.error('File must be smaller than 5MB!');
    }
    return isLt5M;
  }}
/>
```

❌ **Don't** forget to handle upload errors

```typescript
// Bad - no error handling
<Upload action="/upload" />
```

✅ **Do** handle errors

```typescript
// Good
<Upload
  action="/upload"
  onChange={(info) => {
    if (info.file.status === 'error') {
      console.error('Upload failed:', info.file.error);
    }
  }}
/>
```

❌ **Don't** use uncontrolled fileList for critical applications

```typescript
// Bad - can't track or control uploads
<Upload action="/upload" />
```

✅ **Do** use controlled fileList

```typescript
// Good
const [fileList, setFileList] = React.useState([]);
<Upload
  fileList={fileList}
  onChange={(info) => setFileList(info.fileList)}
/>
```

## Related Components

- [Button](./Button.md) - For upload trigger
- [Modal](./Modal.md) - For preview functionality
- [Progress](./Progress.md) - For custom progress display
- [Form](./Form.md) - For form integration


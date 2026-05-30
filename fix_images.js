const fs = require('fs');
const fixFile = (path) => {
    let content = fs.readFileSync(path, 'utf-8');
    content = content.replace(
        import ImagePicker from '@/components/admin/ImagePicker';,
        import ImageUploader from '@/components/admin/ImageUploader';
    );
    content = content.replace(
        /<ImagePicker value=\{formData.imageSrc \|\| formData.heroImage \|\| ''\} onChange=\{\(v: string\) => setFormData\(\{ \.\.\.formData, (imageSrc|heroImage): v \}\)\} \/>/g,
        <ImageUploader currentImage={formData.imageSrc || formData.heroImage || ''} onUpload={(v: string) => setFormData({ ...formData, $1: v })} />
    );
    // There are two variations of how it got scaffolded: Let's use a smarter regex
    fs.writeFileSync(path, content);
};
['app/admin/projects/new/page.tsx', 'app/admin/projects/[id]/edit/page.tsx', 'app/admin/blogs/new/page.tsx', 'app/admin/blogs/[id]/edit/page.tsx'].forEach(p => fixFile(p));

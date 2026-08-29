import LegalLayout from '../legal/LegalLayout';
import GuidesIndex from './GuidesIndex';
import { getGuideBySlug } from '../../constants/guides';

interface Props {
  slug: string;
}

export default function GuideArticle({ slug }: Props) {
  const guide = getGuideBySlug(slug);

  if (!guide) return <GuidesIndex />;

  return (
    <LegalLayout title={guide.title} updatedAt={guide.updatedAt}>
      {guide.content}
    </LegalLayout>
  );
}

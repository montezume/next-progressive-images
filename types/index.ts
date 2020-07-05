type Tag = {
  type: string;
  title: string;
};

export interface Image {
  alt_description: string;
  categories: string[];
  color: string;
  created_at: Date;
  current_user_collections: any[];
  description: string;
  height: number;
  width: number;
  id: string;
  liked_by_user: boolean;
  likes: number;
  links: {
    download: string;
    download_location: string;
    html: string;
    select: string;
  };
  promoted_at: Date;
  sponsorship?: any;
  tags: Tag[];
  updated_at: Date;
  urls: {
    full: string;
    raw: string;
    thumb: string;
    regular: string;
    small: string;
  };
}

// following List
export type string_list_data = {
  href: string;
  value: string;
  timestamp: number;
};
export type media_list_data = [];
export type relationships_following = [
  {
    title: string;
    media_list_data: media_list_data[];
    string_list_data: string_list_data[];
  }
];

// followers List
export type relationships_followers = {
  title: string;
  media_list_data: media_list_data;
  string_list_data: string_list_data;
};

export type following = {
  relationships_following: {
    title: string;
    media_list_data: any[];
    string_list_data: {
      href: string;
      value: string;
      timestamp: number;
    };
  };
};

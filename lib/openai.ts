export interface GenerateLandingPageResponse {
  name: string;
  description: string;
  app_url: string;
  landing_page_html: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

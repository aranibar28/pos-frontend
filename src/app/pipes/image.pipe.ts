import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
  standalone: true,
})
export class ImagePipe implements PipeTransform {
  private readonly DEFAULT_IMAGES_PATH = 'assets/img/';

  transform(value: string, type: string): unknown {
    const defaultImage = this.getDefaultImagePath(type);
    return value ? value : defaultImage;
  }

  private getDefaultImagePath(type: string): string {
    switch (type) {
      case 'business':
        return `${this.DEFAULT_IMAGES_PATH}user.png`;
      case 'categories':
        return `${this.DEFAULT_IMAGES_PATH}category.png`;
      case 'products':
        return `${this.DEFAULT_IMAGES_PATH}product.png`;
      case 'users':
        return `${this.DEFAULT_IMAGES_PATH}user.png`;
      default:
        return '';
    }
  }
}

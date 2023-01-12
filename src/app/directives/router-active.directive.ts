import { Directive, Input, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkWithHref, Router } from '@angular/router';

@Directive({
  selector: '[customRouterLinkActive]',
  standalone: true,
})
export class RouterActiveDirective {
  @Input() customRouterLinkActiveOptions: { exact: boolean } = { exact: false };

  @HostBinding('class.active')
  get isActive(): boolean {
    return (
      (this.customRouterLinkActiveOptions.exact
        ? this.isActive && this.link.urlTree!.toString() === this.router.url
        : this.isActive) || this.isActiveRouterLink()
    );
  }

  private isActiveRouterLink(): boolean {
    return this.router.url === '' && this.link.routerLink!.toString() === '/';
  }
  constructor(
    private link: RouterLink,
    private linkWithHref: RouterLinkWithHref,
    private router: Router
  ) {}
}

/**
 * @module event-source-polyfill
 * @description
 * EventSource의 폴리필 라이브러리 타입 정의입니다.
 * 브라우저에서 기본 EventSource가 지원하지 않는 기능(인증 헤더 등)을 제공합니다.
 */

declare module "event-source-polyfill" {
  /**
   * EventSourcePolyfill
   *
   * Server-Sent Events (SSE)를 위한 폴리필 클래스입니다.
   * 표준 EventSource와 유사하지만, 인증 헤더 및 추가 옵션을 지원합니다.
   *
   * @class
   * @example
   * ```typescript
   * import { EventSourcePolyfill } from 'event-source-polyfill';
   *
   * const eventSource = new EventSourcePolyfill('/api/events', {
   *   headers: {
   *     'Authorization': 'Bearer token'
   *   }
   * });
   *
   * eventSource.onmessage = (event) => {
   *   console.log('Received:', event.data);
   * };
   * ```
   */
  export class EventSourcePolyfill {
    /**
     * EventSourcePolyfill 인스턴스를 생성합니다.
     *
     * @param {string} url - SSE 이벤트를 받을 서버 URL
     * @param {any} [eventSourceInitDict] - 초기화 옵션 (headers, withCredentials 등)
     * @constructor
     */
    constructor(url: string, eventSourceInitDict?: any);

    /**
     * 연결이 열렸을 때 호출되는 이벤트 핸들러입니다.
     *
     * @type {(event: any) => void}
     * @example
     * ```typescript
     * eventSource.onopen = (event) => {
     *   console.log('Connection opened');
     * };
     * ```
     */
    onopen: (event: any) => void;

    /**
     * 서버로부터 메시지를 받았을 때 호출되는 이벤트 핸들러입니다.
     *
     * @type {(event: any) => void}
     * @example
     * ```typescript
     * eventSource.onmessage = (event) => {
     *   console.log('Message:', event.data);
     * };
     * ```
     */
    onmessage: (event: any) => void;

    /**
     * 연결 오류가 발생했을 때 호출되는 이벤트 핸들러입니다.
     *
     * @type {(event: any) => void}
     * @example
     * ```typescript
     * eventSource.onerror = (event) => {
     *   console.error('Connection error:', event);
     * };
     * ```
     */
    onerror: (event: any) => void;

    /**
     * 특정 이벤트 타입에 대한 리스너를 추가합니다.
     *
     * @param {string} type - 이벤트 타입 (예: 'message', 'open', 'error')
     * @param {(event: any) => void} listener - 이벤트 리스너 함수
     * @example
     * ```typescript
     * eventSource.addEventListener('custom-event', (event) => {
     *   console.log('Custom event:', event.data);
     * });
     * ```
     */
    addEventListener(type: string, listener: (event: any) => void): void;

    /**
     * 특정 이벤트 타입에 대한 리스너를 제거합니다.
     *
     * @param {string} type - 이벤트 타입
     * @param {(event: any) => void} listener - 제거할 리스너 함수
     * @example
     * ```typescript
     * const handler = (event) => console.log(event.data);
     * eventSource.addEventListener('message', handler);
     * eventSource.removeEventListener('message', handler);
     * ```
     */
    removeEventListener(type: string, listener: (event: any) => void): void;

    /**
     * EventSource 연결을 닫습니다.
     * 연결을 닫은 후에는 더 이상 이벤트를 받을 수 없습니다.
     *
     * @example
     * ```typescript
     * eventSource.close();
     * ```
     */
    close(): void;
  }
}

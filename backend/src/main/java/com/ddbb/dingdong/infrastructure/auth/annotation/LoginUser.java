package com.ddbb.dingdong.infrastructure.auth.annotation;

import java.lang.annotation.*;

/**
 * 컨트롤러 메서드에서 현재 로그인한 사용자를 주입하는 어노테이션입니다.
 * <p>
 * 세션에서 인증된 사용자 정보를 가져와 자동으로 매개변수에 주입합니다.
 * </p>
 *
 * <p><b>예제:</b></p>
 * <pre>
 * {@code
 * @GetMapping("/me")
 * public ResponseEntity<UserDto> getCurrentUser(@LoginUser AuthUser authUser) {
 *     return ResponseEntity.ok(new UserDto(authUser.getId()));
 * }
 * }
 * </pre>
 *
 * @see com.ddbb.dingdong.infrastructure.auth.annotation.LoginUserArgumentResolver
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LoginUser { }

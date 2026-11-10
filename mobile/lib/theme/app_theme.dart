import 'package:flutter/material.dart';

/// Mesma identidade visual da web ("Acervo"): papel quente, tinta e verde-patina.
/// Contrastes de texto >= 4,5:1 nos dois temas (o tema segue o do sistema).
ThemeData buildTheme(Brightness brightness) {
  final dark = brightness == Brightness.dark;

  final paper = dark ? const Color(0xFF12100E) : const Color(0xFFF6F2EA);
  final surface = dark ? const Color(0xFF1B1814) : const Color(0xFFFFFDF8);
  final ink = dark ? const Color(0xFFECE5D8) : const Color(0xFF1D1A16);
  final muted = dark ? const Color(0xFFA99F8F) : const Color(0xFF5C5448);
  final line = dark ? const Color(0xFF322D26) : const Color(0xFFDDD3C1);
  final control = dark ? const Color(0xFF8B8171) : const Color(0xFF7D7262);
  final accent = dark ? const Color(0xFF6FC2B9) : const Color(0xFF1F5F5B);
  final accentInk = dark ? const Color(0xFF0B1C1A) : const Color(0xFFFFFFFF);
  final danger = dark ? const Color(0xFFF08A82) : const Color(0xFF9B2226);

  final scheme = ColorScheme(
    brightness: brightness,
    primary: accent,
    onPrimary: accentInk,
    secondary: accent,
    onSecondary: accentInk,
    error: danger,
    onError: paper,
    surface: surface,
    onSurface: ink,
    onSurfaceVariant: muted,
    outline: control,
    outlineVariant: line,
  );

  final base = ThemeData(useMaterial3: true, brightness: brightness);

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: paper,
    textTheme: base.textTheme.apply(bodyColor: ink, displayColor: ink),
    appBarTheme: AppBarTheme(
      backgroundColor: paper,
      foregroundColor: ink,
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
  );
}

/// Títulos em serifa, como na web (Georgia/Cambria existem em Windows, macOS e iOS).
TextStyle serifStyle(
  BuildContext context,
  double size, {
  FontWeight weight = FontWeight.w500,
}) {
  return TextStyle(
    fontFamily: 'Georgia',
    fontFamilyFallback: const ['Cambria', 'Times New Roman', 'serif'],
    fontSize: size,
    height: 1.15,
    fontWeight: weight,
    color: Theme.of(context).colorScheme.onSurface,
  );
}

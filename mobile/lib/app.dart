import 'package:flutter/material.dart';

import 'screens/attractions_screen.dart';
import 'theme/app_theme.dart';

class MuseusApp extends StatelessWidget {
  const MuseusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Acervo',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(Brightness.light),
      darkTheme: buildTheme(Brightness.dark),
      themeMode: ThemeMode.system, // segue o tema do sistema
      home: const AttractionsScreen(),
    );
  }
}
